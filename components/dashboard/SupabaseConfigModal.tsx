'use client';

import React, { useState } from 'react';
import { Database, X, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
}

export function SupabaseConfigModal({ isOpen, onClose, isConfigured }: SupabaseConfigModalProps) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envSample = `NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`;

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-[#F8F9FA] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                การเชื่อมต่อฐานข้อมูล Supabase
              </h3>
              <p className="text-xs text-slate-500">
                สถานะปัจจุบัน: {isConfigured ? '🟢 เชื่อมต่อ Supabase Cloud สำเร็จ' : '🟡 กำลังใช้ Local DB (ใส่ Key ใน .env เพื่อสลับ)'}
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

        {/* Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: SQL Script */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>สร้างตารางใน Supabase (SQL Editor)</span>
              </span>
              <a 
                href="https://supabase.com/dashboard/project/fbffythkfzykzrgzpvfx/sql" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>เปิด SQL Editor ของคุณ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-600">
              ไปที่เมนู <strong>SQL Editor</strong> ใน Supabase Dashboard แล้ววางโค้ดจากไฟล์ <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">supabase/schema.sql</code> ซึ่งเตรียมตาราง <code className="bg-slate-200 px-1 py-0.5 rounded">ingredients</code> (พร้อมฟิลด์ Tare Weight สำหรับตัดน้ำหนักภาชนะ, Barcode, หมวดหมู่กาแฟ), RLS Policies และ Seed ข้อมูล 18 รายการไว้พร้อมใช้งาน
            </p>
          </div>

          {/* Step 2: Environment Variables */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>ตรวจสอบไฟล์ .env</span>
              </span>
              <button
                onClick={() => copyToClipboard(envSample, 'env')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 border border-slate-300 rounded px-2 py-1 bg-white"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'คัดลอกแล้ว' : 'คัดลอกตัวอย่าง'}</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-600">
              ไฟล์ <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code> ในโปรเจกต์ได้รับการกำหนดค่า URL และ Anon Key ของ Supabase พร้อมใช้งานแล้ว
            </p>
          </div>

          {/* System status info */}
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold">ระบบรองรับการสลับแบบอัตโนมัติ (Zero Downtime)</div>
            <div>เมื่อรัน SQL สคริปต์ใน Supabase แล้ว ข้อมูลสต็อกจะซิงค์และบันทึกลง Cloud Database โดยตรงแบบ Real-time ทันทีครับ</div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm touch-press transition-colors"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
