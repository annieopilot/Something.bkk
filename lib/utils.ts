import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number): string {
  if (isNaN(value)) return "฿0";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

export function getStockStatus(currentStock: number, minStockLevel: number): StockStatus {
  if (currentStock <= 0) return 'out_of_stock';
  if (currentStock <= minStockLevel) return 'low_stock';
  return 'in_stock';
}
