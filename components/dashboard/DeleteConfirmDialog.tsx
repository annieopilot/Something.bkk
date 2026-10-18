'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Ingredient } from '@/types/ingredient';
import { formatNumber } from '@/lib/utils';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  ingredient: Ingredient | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  ingredient,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) {
  if (!isOpen || !ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#C62828]/10 text-[#C62828] flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            ยืนยันการลบวัตถุดิบ?
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            คุณกำลังจะลบรายการวัตถุดิบนี้ออกจากระบบอย่างถาวร
          </p>

          {/* Ingredient Details Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
            <div className="font-bold text-[#1A1A1A] text-base">
              {ingredient.name}
            </div>
            <div className="text-xs text-slate-600 flex justify-between">
              <span>หมวดหมู่:</span>
              <span className="font-semibold">{ingredient.category || 'ทั่วไป'}</span>
            </div>
            <div className="text-xs text-slate-600 flex justify-between">
              <span>สต็อกคงเหลือปัจจุบัน:</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(ingredient.currentStock, 1)} {ingredient.unit}
              </span>
            </div>
            {ingredient.tareWeight > 0 && (
              <div className="text-xs text-[#1565C0] flex justify-between">
                <span>น้ำหนักภาชนะ (Tare):</span>
                <span className="font-semibold">{formatNumber(ingredient.tareWeight, 1)} g</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 touch-press transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 px-4 rounded-lg bg-[#C62828] hover:bg-[#a82222] active:bg-[#8c1c1c] text-white font-semibold text-sm flex items-center justify-center space-x-2 touch-press transition-colors disabled:opacity-50 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'กำลังลบ...' : 'ลบวัตถุดิบ'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
