'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Scale, RefreshCw, Layers, ShoppingBag, BarChart3, AlertCircle, Database } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
  onOpenScaleModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalLowStock: number;
  isSupabaseConnected: boolean;
  onOpenSupabaseConfig: () => void;
}

export function Header({
  onAddNew,
  onOpenScaleModal,
  onRefresh,
  isRefreshing,
  totalLowStock,
  isSupabaseConnected,
  onOpenSupabaseConfig,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('th-TH', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#FFFFFF] border-b border-slate-200 sticky top-0 z-30">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & POS Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#2D2B2A] flex items-center justify-center text-[#F8F9FA] shadow-sm">
              <Coffee className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                  BREW & CO. POS
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#8B5A2B]/10 text-[#8B5A2B]">
                  Stock Module v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ระบบบริหารสต็อกวัตถุดิบ & น้ำหนักภาชนะ (Tare Weight System)
              </p>
            </div>
          </div>

          {/* Right Controls: Database Badge + Clock + Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Supabase Connection Status Badge */}
            <button
              onClick={onOpenSupabaseConfig}
              title="คลิกเพื่อดูการตั้งค่า Supabase"
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium touch-press transition-colors ${
                isSupabaseConnected
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{isSupabaseConnected ? 'Supabase Cloud DB' : 'เชื่อมต่อ Supabase'}</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="รีเฟรชข้อมูลสต็อก"
              className="h-12 w-12 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-press transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-[#8B5A2B]' : ''}`} />
            </button>

            {/* Scale Tare Quick Tool */}
            <button
              onClick={onOpenScaleModal}
              className="h-12 px-4 rounded-lg border border-[#1565C0]/30 bg-[#1565C0]/5 hover:bg-[#1565C0]/10 active:bg-[#1565C0]/15 text-[#1565C0] font-medium text-sm flex items-center space-x-2 touch-press transition-colors"
            >
              <Scale className="w-5 h-5 text-[#1565C0]" />
              <span className="hidden sm:inline">ชั่งตัดภาชนะ (Tare Deduct)</span>
              <span className="sm:hidden">ชั่งตัดน้ำหนัก</span>
            </button>

            {/* Add New Ingredient Button */}
            <button
              onClick={onAddNew}
              className="h-12 px-5 rounded-lg bg-[#2D2B2A] hover:bg-[#1f1e1d] active:bg-[#151414] text-white font-medium text-sm flex items-center space-x-2 shadow-sm touch-press transition-colors"
            >
              <Plus className="w-5 h-5 text-[#D4A373]" />
              <span>เพิ่มวัตถุดิบใหม่</span>
            </button>
          </div>
        </div>

        {/* Future Module Navigation Bar */}
        <div className="flex items-center space-x-1 border-t border-slate-100 overflow-x-auto py-1.5 no-scrollbar text-xs font-medium">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#2D2B2A] text-white font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>คลังวัตถุดิบ (Inventory)</span>
          </button>
          
          <button 
            disabled 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-600 cursor-not-allowed opacity-60"
            title="โมดูลสูตรและเมนู (ขยายระบบในเฟสถัดไป)"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>สูตรชง & เมนู (Recipes)</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">เร็วๆ นี้</span>
          </button>

          <button 
            disabled 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-600 cursor-not-allowed opacity-60"
            title="โมดูลจุดขายหน้าร้าน (ขยายระบบในเฟสถัดไป)"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ขายหน้าร้าน (Cashier POS)</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">เร็วๆ นี้</span>
          </button>

          <button 
            disabled 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-600 cursor-not-allowed opacity-60"
            title="รายงานสต็อกและต้นทุน (ขยายระบบในเฟสถัดไป)"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>รายงาน & ต้นทุน (Reports)</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500">เร็วๆ นี้</span>
          </button>

          {totalLowStock > 0 && (
            <div className="ml-auto flex items-center space-x-1 px-2.5 py-1 rounded bg-[#E65100]/10 text-[#E65100] text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-[#E65100]" />
              <span>เตือนของใกล้หมด {totalLowStock} รายการ</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
