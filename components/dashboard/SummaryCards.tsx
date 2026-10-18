'use client';

import React from 'react';
import { Package, AlertTriangle, XCircle, Grid, Coins } from 'lucide-react';
import { InventoryStats } from '@/types/ingredient';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  stats: InventoryStats;
  currentFilter: 'all' | 'low' | 'out' | 'in_stock';
  onFilterChange: (status: 'all' | 'low' | 'out' | 'in_stock') => void;
}

export function SummaryCards({ stats, currentFilter, onFilterChange }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Total Items */}
      <div
        onClick={() => onFilterChange('all')}
        className={`bg-white rounded-xl border p-4 sm:p-5 cursor-pointer touch-press transition-all ${
          currentFilter === 'all'
            ? 'border-[#2D2B2A] ring-2 ring-[#2D2B2A]/10 shadow-sm'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">วัตถุดิบทั้งหมด</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {formatNumber(stats.totalItems)}
          </span>
          <span className="text-xs text-slate-500 font-medium">รายการ</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">คลิกเพื่อดูทั้งหมด</p>
      </div>

      {/* 2. Low Stock Alert */}
      <div
        onClick={() => onFilterChange(currentFilter === 'low' ? 'all' : 'low')}
        className={`bg-white rounded-xl border p-4 sm:p-5 cursor-pointer touch-press transition-all ${
          currentFilter === 'low'
            ? 'border-[#E65100] ring-2 ring-[#E65100]/20 bg-[#FFF8F2]'
            : 'border-slate-200 hover:border-[#E65100]/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-[#E65100]">ของใกล้หมด (Low)</span>
          <div className="w-8 h-8 rounded-lg bg-[#E65100]/10 flex items-center justify-center text-[#E65100]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1.5">
          <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stats.lowStockCount > 0 ? 'text-[#E65100]' : 'text-slate-800'}`}>
            {formatNumber(stats.lowStockCount)}
          </span>
          <span className="text-xs text-slate-500 font-medium">รายการ</span>
        </div>
        <p className="mt-1 text-[11px] text-[#E65100] font-medium">
          {stats.lowStockCount > 0 ? 'ต้องสั่งซื้อเติมสต็อกด่วน' : 'สต็อกอยู่ในเกณฑ์ปกติ'}
        </p>
      </div>

      {/* 3. Out of Stock Alert */}
      <div
        onClick={() => onFilterChange(currentFilter === 'out' ? 'all' : 'out')}
        className={`bg-white rounded-xl border p-4 sm:p-5 cursor-pointer touch-press transition-all ${
          currentFilter === 'out'
            ? 'border-[#C62828] ring-2 ring-[#C62828]/20 bg-[#FFF5F5]'
            : 'border-slate-200 hover:border-[#C62828]/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-[#C62828]">หมดสต็อก (Out)</span>
          <div className="w-8 h-8 rounded-lg bg-[#C62828]/10 flex items-center justify-center text-[#C62828]">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1.5">
          <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stats.outOfStockCount > 0 ? 'text-[#C62828]' : 'text-slate-800'}`}>
            {formatNumber(stats.outOfStockCount)}
          </span>
          <span className="text-xs text-slate-500 font-medium">รายการ</span>
        </div>
        <p className="mt-1 text-[11px] text-[#C62828] font-medium">
          {stats.outOfStockCount > 0 ? 'มีวัตถุดิบเป็น 0' : 'ไม่มีวัตถุดิบขาด'}
        </p>
      </div>

      {/* 4. Total Categories */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">หมวดหมู่สินค้า</span>
          <div className="w-8 h-8 rounded-lg bg-[#8B5A2B]/10 flex items-center justify-center text-[#8B5A2B]">
            <Grid className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {formatNumber(stats.categoriesCount)}
          </span>
          <span className="text-xs text-slate-500 font-medium">หมวด</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">แยกตามประเภทวัตถุดิบ</p>
      </div>

      {/* 5. Total Valuation (Cost) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">มูลค่าคลังโดยประมาณ</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-1">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
            {formatCurrency(stats.totalEstimatedValue)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">คำนวณจากต้นทุนต่อหน่วย</p>
      </div>

    </div>
  );
}
