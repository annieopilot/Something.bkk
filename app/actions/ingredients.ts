'use server';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import prisma from '@/lib/prisma';
import { Ingredient, IngredientInput, InventoryStats } from '@/types/ingredient';
import { revalidatePath } from 'next/cache';

/**
 * ตรวจสอบว่าระบบกำลังเชื่อมต่อกับ Supabase หรือ Local Database
 */
export async function getDatabaseConnectionStatus(): Promise<{
  provider: 'supabase' | 'sqlite_fallback';
  isConfigured: boolean;
  supabaseUrl?: string;
}> {
  return {
    provider: isSupabaseConfigured ? 'supabase' : 'sqlite_fallback',
    isConfigured: isSupabaseConfigured,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  };
}

/**
 * ดึงรายการวัตถุดิบทั้งหมด (Read)
 */
export async function getIngredients(params?: {
  search?: string;
  category?: string;
  status?: 'all' | 'low' | 'out' | 'in_stock';
  sortBy?: 'name' | 'currentStock' | 'tareWeight' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ success: boolean; data: Ingredient[]; provider: string; error?: string }> {
  try {
    const {
      search,
      category,
      status = 'all',
      sortBy = 'name',
      sortOrder = 'asc',
    } = params || {};

    // 1. ถ้ามี Supabase Config ให้ดึงจาก Supabase
    if (isSupabaseConfigured) {
      let query = supabase
        .from('ingredients')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search && search.trim() !== '') {
        query = query.or(`name.ilike.%${search.trim()}%,supplier.ilike.%${search.trim()}%,notes.ilike.%${search.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('⚠️ Supabase table "ingredients" does not exist yet. Please run supabase/schema.sql in Supabase SQL Editor.');
          // ดึงจาก local fallback ชั่วคราวจนกว่าผู้ใช้จะรัน schema.sql ใน Supabase
          const localItems = await prisma.ingredient.findMany({
            where: category && category !== 'all' ? { category } : {},
            orderBy: { [sortBy]: sortOrder },
          });
          return { 
            success: true, 
            data: localItems, 
            provider: 'supabase_pending_schema',
            error: 'เชื่อมต่อ Supabase สำเร็จแล้ว แต่ยังไม่พบตาราง ingredients กรุณานำ supabase/schema.sql ไปรันใน SQL Editor' 
          };
        }
        console.error('Supabase query error:', error);
        throw error;
      }

      let items = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        tareWeight: Number(item.tareWeight) || 0,
        currentStock: Number(item.currentStock) || 0,
        minStockLevel: Number(item.minStockLevel) || 0,
        category: item.category,
        costPerUnit: Number(item.costPerUnit) || 0,
        supplier: item.supplier,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) as Ingredient[];

      // กรองสถานะสต็อก
      if (status === 'out') {
        items = items.filter((item) => item.currentStock <= 0);
      } else if (status === 'low') {
        items = items.filter((item) => item.currentStock > 0 && item.currentStock <= item.minStockLevel);
      } else if (status === 'in_stock') {
        items = items.filter((item) => item.currentStock > item.minStockLevel);
      }

      return { success: true, data: items, provider: 'supabase' };
    }

    // 2. ถ้ายังไม่ได้ใส่ Supabase Config ให้ใช้ Local Prisma SQLite Fallback
    const where: any = {};
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim() } },
        { notes: { contains: search.trim() } },
        { supplier: { contains: search.trim() } },
      ];
    }
    if (category && category !== 'all') {
      where.category = category;
    }

    let items = await prisma.ingredient.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    if (status === 'out') {
      items = items.filter((item) => item.currentStock <= 0);
    } else if (status === 'low') {
      items = items.filter((item) => item.currentStock > 0 && item.currentStock <= item.minStockLevel);
    } else if (status === 'in_stock') {
      items = items.filter((item) => item.currentStock > item.minStockLevel);
    }

    return { success: true, data: items, provider: 'sqlite_fallback' };
  } catch (error: any) {
    console.error('Failed to fetch ingredients:', error);
    return { success: false, data: [], provider: 'unknown', error: error.message || 'ไม่สามารถดึงข้อมูลได้' };
  }
}

/**
 * ดึงข้อมูลสรุปภาพรวมสต็อก (Summary Cards Stats)
 */
export async function getInventoryStats(): Promise<InventoryStats> {
  try {
    let allItems: any[] = [];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('ingredients').select('*');
      if (error) {
        if (error.code === 'PGRST205') {
          allItems = await prisma.ingredient.findMany();
        } else {
          throw error;
        }
      } else {
        allItems = (data || []).map((item) => ({
          ...item,
          currentStock: Number(item.currentStock) || 0,
          minStockLevel: Number(item.minStockLevel) || 0,
          costPerUnit: Number(item.costPerUnit) || 0,
        }));
      }
    } else {
      allItems = await prisma.ingredient.findMany();
    }

    const totalItems = allItems.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalEstimatedValue = 0;
    const uniqueCategories = new Set<string>();

    for (const item of allItems) {
      if (item.category) uniqueCategories.add(item.category);

      if (item.currentStock <= 0) {
        outOfStockCount++;
      } else if (item.currentStock <= item.minStockLevel) {
        lowStockCount++;
      }

      if (item.costPerUnit && item.currentStock > 0) {
        totalEstimatedValue += item.costPerUnit * item.currentStock;
      }
    }

    return {
      totalItems,
      lowStockCount,
      outOfStockCount,
      categoriesCount: uniqueCategories.size,
      totalEstimatedValue,
    };
  } catch (error) {
    console.error('Failed to get inventory stats:', error);
    return {
      totalItems: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      categoriesCount: 0,
      totalEstimatedValue: 0,
    };
  }
}

/**
 * สร้างวัตถุดิบใหม่ (Create)
 */
export async function createIngredient(
  data: IngredientInput
): Promise<{ success: boolean; data?: Ingredient; error?: string }> {
  try {
    if (!data.name || data.name.trim() === '') {
      return { success: false, error: 'กรุณากรอกชื่อวัตถุดิบ' };
    }
    if (!data.unit || data.unit.trim() === '') {
      return { success: false, error: 'กรุณาระบุหน่วยนับ' };
    }

    const payload = {
      name: data.name.trim(),
      unit: data.unit.trim(),
      tareWeight: Number(data.tareWeight) || 0,
      currentStock: Number(data.currentStock) || 0,
      minStockLevel: Number(data.minStockLevel) || 0,
      category: data.category?.trim() || null,
      costPerUnit: Number(data.costPerUnit) || 0,
      supplier: data.supplier?.trim() || null,
      notes: data.notes?.trim() || null,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data: created, error } = await supabase
        .from('ingredients')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/');
      return { success: true, data: created };
    } else {
      const created = await prisma.ingredient.create({
        data: payload,
      });
      revalidatePath('/');
      return { success: true, data: created };
    }
  } catch (error: any) {
    console.error('Failed to create ingredient:', error);
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
  }
}

/**
 * อัปเดตข้อมูลวัตถุดิบเดิม (Update)
 */
export async function updateIngredient(
  id: string,
  data: Partial<IngredientInput>
): Promise<{ success: boolean; data?: Ingredient; error?: string }> {
  try {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.unit !== undefined) updateData.unit = data.unit.trim();
    if (data.tareWeight !== undefined) updateData.tareWeight = Number(data.tareWeight) || 0;
    if (data.currentStock !== undefined) updateData.currentStock = Number(data.currentStock) || 0;
    if (data.minStockLevel !== undefined) updateData.minStockLevel = Number(data.minStockLevel) || 0;
    if (data.category !== undefined) updateData.category = data.category?.trim() || null;
    if (data.costPerUnit !== undefined) updateData.costPerUnit = Number(data.costPerUnit) || 0;
    if (data.supplier !== undefined) updateData.supplier = data.supplier?.trim() || null;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;

    if (isSupabaseConfigured) {
      const { data: updated, error } = await supabase
        .from('ingredients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath('/');
      return { success: true, data: updated };
    } else {
      const updated = await prisma.ingredient.update({
        where: { id },
        data: updateData,
      });
      revalidatePath('/');
      return { success: true, data: updated };
    }
  } catch (error: any) {
    console.error('Failed to update ingredient:', error);
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' };
  }
}

/**
 * ลบวัตถุดิบ (Delete)
 */
export async function deleteIngredient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      revalidatePath('/');
      return { success: true };
    } else {
      await prisma.ingredient.delete({
        where: { id },
      });
      revalidatePath('/');
      return { success: true };
    }
  } catch (error: any) {
    console.error('Failed to delete ingredient:', error);
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการลบวัตถุดิบ' };
  }
}

/**
 * ปรับยอดสต็อกอย่างรวดเร็ว (Quick Adjust Stock)
 */
export async function quickAdjustStock(
  id: string,
  amount: number,
  mode: 'set' | 'add' | 'subtract'
): Promise<{ success: boolean; data?: Ingredient; error?: string }> {
  try {
    let currentStock = 0;

    if (isSupabaseConfigured) {
      const { data: item, error: fetchErr } = await supabase
        .from('ingredients')
        .select('currentStock')
        .eq('id', id)
        .single();

      if (fetchErr || !item) throw new Error('ไม่พบวัตถุดิบ');
      currentStock = Number(item.currentStock) || 0;
    } else {
      const existing = await prisma.ingredient.findUnique({ where: { id } });
      if (!existing) throw new Error('ไม่พบวัตถุดิบ');
      currentStock = existing.currentStock;
    }

    let newStock = currentStock;
    if (mode === 'set') newStock = Math.max(0, amount);
    else if (mode === 'add') newStock = Math.max(0, currentStock + amount);
    else if (mode === 'subtract') newStock = Math.max(0, currentStock - amount);

    return await updateIngredient(id, { currentStock: newStock });
  } catch (error: any) {
    console.error('Failed to adjust stock:', error);
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการปรับยอดสต็อก' };
  }
}

/**
 * คำนวณสต็อกสุทธิจากการชั่งน้ำหนักรวม (Gross Weight Tare Deduction)
 */
export async function adjustStockByGrossWeight(
  id: string,
  grossWeight: number
): Promise<{ success: boolean; data?: Ingredient; netWeight?: number; error?: string }> {
  try {
    let tareWeight = 0;

    if (isSupabaseConfigured) {
      const { data: item, error: fetchErr } = await supabase
        .from('ingredients')
        .select('tareWeight')
        .eq('id', id)
        .single();

      if (fetchErr || !item) throw new Error('ไม่พบวัตถุดิบ');
      tareWeight = Number(item.tareWeight) || 0;
    } else {
      const existing = await prisma.ingredient.findUnique({ where: { id } });
      if (!existing) throw new Error('ไม่พบวัตถุดิบ');
      tareWeight = existing.tareWeight;
    }

    const netWeight = Math.max(0, Number(grossWeight) - tareWeight);
    const updateRes = await updateIngredient(id, { currentStock: netWeight });

    return { ...updateRes, netWeight };
  } catch (error: any) {
    console.error('Failed to adjust stock by gross weight:', error);
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการคำนวณน้ำหนัก' };
  }
}
