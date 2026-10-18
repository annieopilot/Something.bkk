'use client';

import React, { useState, useEffect } from 'react';
import { Scale, X, ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Ingredient } from '@/types/ingredient';
import { formatNumber } from '@/lib/utils';

interface TareScaleModalProps {
  isOpen: boolean;
  ingredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  onClose: () => void;
  onApplyStock: (id: string, netStock: number) => Promise<boolean>;
  loading: boolean;
}

export function TareScaleModal({
  isOpen,
  ingredients,
  selectedIngredient,
  onClose,
  onApplyStock,
  loading,
}: TareScaleModalProps) {
  const [activeItem, setActiveItem] = useState<Ingredient | null>(selectedIngredient);
  const [grossWeight, setGrossWeight] = useState<string>('');

  useEffect(() => {
    setActiveItem(selectedIngredient);
    setGrossWeight('');
  }, [selectedIngredient, isOpen]);

  if (!isOpen) return null;

  const currentTare = activeItem ? activeItem.tareWeight : 0;
  const grossNum = parseFloat(grossWeight) || 0;
  const calculatedNet = Math.max(0, grossNum - currentTare);

  const handleApply = async () => {
    if (!activeItem) return;
    const success = await onApplyStock(activeItem.id, calculatedNet);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-[#1565C0]/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1565C0] flex items-center justify-center text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1565C0]">
                เครื่องคิดเลขชั่งตัดภาชนะ (Tare Deduct Tool)
              </h3>
              <p className="text-xs text-slate-500">
                วางบรรจุภัณฑ์บนตราชั่ง &rarr; กรอกน้ำหนักรวม &rarr; หักภาชนะอัตโนมัติ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 touch-press transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Select Ingredient Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกวัตถุดิบที่ต้องการชั่งนับสต็อก
            </label>
            <select
              value={activeItem?.id || ''}
              onChange={(e) => {
                const found = ingredients.find((i) => i.id === e.target.value);
                setActiveItem(found || null);
              }}
              className="w-full h-12 px-3.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent transition-all"
            >
              <option value="" disabled>-- เลือกวัตถุดิบ --</option>
              {ingredients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category}) - Tare: {item.tareWeight}g
                </option>
              ))}
            </select>
          </div>

          {activeItem && (
            <>
              {/* Tare Info Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">น้ำหนักภาชนะเปล่า (Tare Weight ที่บันทึกไว้)</span>
                  <span className="text-base font-bold text-[#1565C0]">
                    {formatNumber(activeItem.tareWeight, 1)} g
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">สต็อกปัจจุบันในระบบ</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(activeItem.currentStock, 1)} {activeItem.unit}
                  </span>
                </div>
              </div>

              {/* Gross Weight Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ค่าน้ำหนักรวมบนหน้าจอตาชั่ง (Gross Weight รวมภาชนะ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="เช่น 850"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    autoFocus
                    className="w-full h-14 pl-4 pr-16 rounded-xl border-2 border-[#1565C0]/40 bg-white text-2xl font-bold text-[#1A1A1A] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent transition-all"
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm font-bold text-slate-500">
                    {activeItem.unit}
                  </span>
                </div>
              </div>

              {/* Live Calculation Formula Card */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                  <span>สูตรคำนวณหัก Tare:</span>
                  <span>Gross ({grossNum}g) - Tare ({currentTare}g)</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    สต็อกสุทธิแท้จริง (Net Stock):
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-extrabold text-[#2E7D32] tabular-nums">
                      {formatNumber(calculatedNet, 1)}
                    </span>
                    <span className="text-sm font-bold text-slate-600">{activeItem.unit}</span>
                  </div>
                </div>

                {grossNum > 0 && grossNum < currentTare && (
                  <p className="text-xs text-[#C62828] flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>น้ำหนักที่ชั่งได้น้อยกว่าน้ำหนักภาชนะเปล่า โปรดตรวจสอบตราชั่ง</span>
                  </p>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-12 px-5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 touch-press transition-colors"
          >
            ปิด
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={loading || !activeItem || grossNum <= 0}
            className="h-12 px-6 rounded-lg bg-[#1565C0] hover:bg-[#0d47a1] text-white font-semibold text-sm flex items-center space-x-2 touch-press transition-colors disabled:opacity-50 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'กำลังบันทึก...' : 'อัปเดตยอดสต็อกสุทธิทันที'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
