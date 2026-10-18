import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/ingredients - รองรับ external POS scanners, tablet POS, หรือ integration
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    const items = await prisma.ingredient.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/ingredients - เพิ่มวัตถุดิบ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, unit, tareWeight, currentStock, minStockLevel, category, costPerUnit, supplier, notes } = body;

    if (!name || !unit) {
      return NextResponse.json(
        { success: false, error: 'Name and unit are required' },
        { status: 400 }
      );
    }

    const item = await prisma.ingredient.create({
      data: {
        name,
        unit,
        tareWeight: Number(tareWeight) || 0,
        currentStock: Number(currentStock) || 0,
        minStockLevel: Number(minStockLevel) || 0,
        category: category || null,
        costPerUnit: Number(costPerUnit) || 0,
        supplier: supplier || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
