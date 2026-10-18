export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  tareWeight: number;
  currentStock: number;
  minStockLevel: number;
  category: string | null;
  costPerUnit?: number | null;
  supplier?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IngredientInput {
  name: string;
  unit: string;
  tareWeight: number;
  currentStock: number;
  minStockLevel: number;
  category?: string;
  costPerUnit?: number;
  supplier?: string;
  notes?: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoriesCount: number;
  totalEstimatedValue: number;
}

export const COMMON_CATEGORIES = [
  'เมล็ดกาแฟ',
  'นมและทางเลือก',
  'ชาและผงเครื่องดื่ม',
  'ไซรัปและซอส',
  'บรรจุภัณฑ์',
  'ของใช้อื่นๆ',
] as const;

export const COMMON_UNITS = [
  { label: 'กรัม (g)', value: 'g' },
  { label: 'มิลลิลิตร (ml)', value: 'ml' },
  { label: 'ชิ้น / แก้ว (pcs)', value: 'pcs' },
  { label: 'กิโลกรัม (kg)', value: 'kg' },
  { label: 'ลิตร (L)', value: 'L' },
  { label: 'แพ็ค / ห่อ (pack)', value: 'pack' },
] as const;
