import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleIngredients = [
  // หมวด: เมล็ดกาแฟ (Coffee Beans)
  {
    name: 'เมล็ดกาแฟปางขอน (Pangkhon Washed)',
    unit: 'g',
    tareWeight: 14.5, // ซองฟอยล์พร้อมวาล์ว 250g
    currentStock: 1250.0,
    minStockLevel: 500.0,
    category: 'เมล็ดกาแฟ',
    costPerUnit: 0.65, // บาท/กรัม
    supplier: 'ดอยปางขอน เชียงราย',
    notes: 'Medium Light Roast สำหรับ Filter และ Americano รสโทนนัทตี้ ช็อกโกแลต ดอกไม้สีขาว'
  },
  {
    name: 'เมล็ดกาแฟ House Blend (Arabica 70% / Robusta 30%)',
    unit: 'g',
    tareWeight: 22.0, // ถุง 1kg พร้อมวาล์ว
    currentStock: 350.0, // ใกล้หมด! (Warning)
    minStockLevel: 1000.0,
    category: 'เมล็ดกาแฟ',
    costPerUnit: 0.42,
    supplier: 'Local Roaster BKK',
    notes: 'Medium Dark Roast สำหรับเมนูนมเย็น Signature Espresso เย็นและลาเต้'
  },
  {
    name: 'เมล็ดกาแฟเอธิโอเปีย ยีกาเชฟ (Ethiopia Yirgacheffe Natural)',
    unit: 'g',
    tareWeight: 14.5,
    currentStock: 0.0, // หมดสต็อก! (Danger)
    minStockLevel: 250.0,
    category: 'เมล็ดกาแฟ',
    costPerUnit: 1.20,
    supplier: 'Specialty Importer Co.',
    notes: 'Light Roast สำหรับ Drip / Cold Brew โน้ตเบอร์รี่ ฟลอรัล สดชื่น'
  },
  {
    name: 'เมล็ดกาแฟบราซิล เซอร์ราโด (Brazil Cerrado)',
    unit: 'g',
    tareWeight: 18.0,
    currentStock: 2200.0,
    minStockLevel: 800.0,
    category: 'เมล็ดกาแฟ',
    costPerUnit: 0.58,
    supplier: 'Specialty Importer Co.',
    notes: 'Medium Roast โน้ตช็อกโกแลต ถั่ว บอดี้แน่น'
  },

  // หมวด: นมและทางเลือก (Milk & Plant-based)
  {
    name: 'นมสด Meiji Pasteurized (4,300 ml)',
    unit: 'ml',
    tareWeight: 140.0, // แกลลอนพลาสติกเปล่า
    currentStock: 8600.0,
    minStockLevel: 4300.0,
    category: 'นมและทางเลือก',
    costPerUnit: 0.052,
    supplier: 'CP-Meiji',
    notes: 'นมวัวสดพาสเจอร์ไรส์รสจืด ตีโฟมนมเนียนเงา'
  },
  {
    name: 'นมข้าวโอ๊ต Oatly Barista Edition (1,000 ml)',
    unit: 'ml',
    tareWeight: 42.0, // กล่องกระดาษ UHT เปล่า
    currentStock: 950.0, // ใกล้หมด (Warning)
    minStockLevel: 2000.0,
    category: 'นมและทางเลือก',
    costPerUnit: 0.125,
    supplier: 'Oatly Thailand',
    notes: 'นมพืชยอดนิยมสำหรับลาเต้อาร์ต เหมาะกับสาย Vegan'
  },
  {
    name: 'นมข้นหวาน มะลิ Professional (2,000 g)',
    unit: 'g',
    tareWeight: 35.0, // ถุงพลาสติก refill พร้อมฝาจุก
    currentStock: 3400.0,
    minStockLevel: 1500.0,
    category: 'นมและทางเลือก',
    costPerUnit: 0.065,
    supplier: 'Mali Group',
    notes: 'สูตรข้นหวานกลมกล่อม สำหรับเมนูไทยสไตล์'
  },
  {
    name: 'นมข้นจืด คาร์เนชัน เอ็กซ์ตร้า (1,000 ml)',
    unit: 'ml',
    tareWeight: 38.0,
    currentStock: 2800.0,
    minStockLevel: 1000.0,
    category: 'นมและทางเลือก',
    costPerUnit: 0.055,
    supplier: 'Nestlé Foodservice',
    notes: 'สำหรับชงชาไทย กาแฟโบราณ และเพิ่มความมัน'
  },

  // หมวด: ชาและผงเครื่องดื่ม (Tea & Powders)
  {
    name: 'ผงมัทฉะอุจิพรีเมียม (Ceremonial Uji Matcha)',
    unit: 'g',
    tareWeight: 65.0, // กระปุกอลูมิเนียมเก็บกลิ่น
    currentStock: 85.0, // ใกล้หมด! (Warning)
    minStockLevel: 150.0,
    category: 'ชาและผงเครื่องดื่ม',
    costPerUnit: 3.50,
    supplier: 'Kyoto Imports',
    notes: 'ผงชาเขียวเกรดพิธีชงชา สีเขียวมรกต อูมามิเด่นชัด'
  },
  {
    name: 'ผงโกโก้ดัตช์ 100% (Dutch Cocoa Powder)',
    unit: 'g',
    tareWeight: 125.0, // โหลสูญญากาศหน้าร้าน
    currentStock: 1450.0,
    minStockLevel: 500.0,
    category: 'ชาและผงเครื่องดื่ม',
    costPerUnit: 0.45,
    supplier: 'Bakery Supply Hub',
    notes: 'โกโก้แท้ไขมัน 22-24% เข้มข้น หอมมัน'
  },
  {
    name: 'ชาไทยตรามือ ชาแดงปรุงสำเร็จ',
    unit: 'g',
    tareWeight: 18.0,
    currentStock: 1800.0,
    minStockLevel: 500.0,
    category: 'ชาและผงเครื่องดื่ม',
    costPerUnit: 0.16,
    supplier: 'ChaTraMue Official',
    notes: 'ใบชาแดงบดละเอียด กลิ่นหอมชาไทยอันเป็นเอกลักษณ์'
  },

  // หมวด: ไซรัปและซอส (Syrups & Sauces)
  {
    name: 'ไซรัปวานิลลา Monin (700 ml)',
    unit: 'ml',
    tareWeight: 460.0, // ขวดแก้วหนาเปล่า พร้อมหัวปั๊ม
    currentStock: 480.0,
    minStockLevel: 300.0,
    category: 'ไซรัปและซอส',
    costPerUnit: 0.48,
    supplier: 'Monin Thailand',
    notes: 'หัวเชื้อวานิลลาธรรมชาติจากมาดากัสการ์'
  },
  {
    name: 'ไซรัปคาราเมล Monin (700 ml)',
    unit: 'ml',
    tareWeight: 460.0,
    currentStock: 150.0, // ใกล้หมด! (Warning)
    minStockLevel: 350.0,
    category: 'ไซรัปและซอส',
    costPerUnit: 0.48,
    supplier: 'Monin Thailand',
    notes: 'รสคาราเมลเข้มข้น หวานหอมกลมกล่อม'
  },
  {
    name: 'ซอสช็อกโกแลตเข้มข้น Davinci (2,000 ml)',
    unit: 'ml',
    tareWeight: 110.0, // ขวดแกลลอนพลาสติกพร้อมปั๊ม
    currentStock: 1600.0,
    minStockLevel: 500.0,
    category: 'ไซรัปและซอส',
    costPerUnit: 0.35,
    supplier: 'Kerry Foodservice',
    notes: 'ดาร์กช็อกโกแลตแท้ สำหรับมอคค่าและราดแต่งแก้ว'
  },

  // หมวด: บรรจุภัณฑ์และของใช้ (Packaging & Supplies)
  {
    name: 'แก้วกาแฟร้อน Double Wall 8oz',
    unit: 'pcs',
    tareWeight: 0.0,
    currentStock: 350.0,
    minStockLevel: 200.0,
    category: 'บรรจุภัณฑ์',
    costPerUnit: 2.20,
    supplier: 'EcoCup Packaging',
    notes: 'แก้วกระดาษคราฟต์สองชั้น ไม่ร้อนมือ ไม่ต้องใช้ปลอก'
  },
  {
    name: 'แก้วพลาสติกเย็น PET 16oz (ปาก 98mm)',
    unit: 'pcs',
    tareWeight: 0.0,
    currentStock: 80.0, // ใกล้หมดมาก! (Warning)
    minStockLevel: 300.0,
    category: 'บรรจุภัณฑ์',
    costPerUnit: 1.85,
    supplier: 'EcoCup Packaging',
    notes: 'พลาสติกใสระดับพรีเมียม รีไซเคิลได้ 100%'
  },
  {
    name: 'ฝายกดื่ม Sip Lid 98mm (ไม่ใช้หลอด)',
    unit: 'pcs',
    tareWeight: 0.0,
    currentStock: 450.0,
    minStockLevel: 300.0,
    category: 'บรรจุภัณฑ์',
    costPerUnit: 0.85,
    supplier: 'EcoCup Packaging',
    notes: 'ฝาแบบยกดื่ม ล็อคแน่น ไม่หกเลอะ'
  },
  {
    name: 'หลอดกระดาษไบโอห่อซองเดี่ยว 8mm',
    unit: 'pcs',
    tareWeight: 0.0,
    currentStock: 600.0,
    minStockLevel: 200.0,
    category: 'บรรจุภัณฑ์',
    costPerUnit: 0.40,
    supplier: 'BioStraw Co.',
    notes: 'หลอดรักษ์โลก แช่เครื่องดื่มได้นานไม่เปื่อยง่าย'
  }
];

async function main() {
  console.log('🌱 กำลังเริ่มต้น Seed ข้อมูลสต็อกวัตถุดิบร้านกาแฟ...');

  // เคลียร์ข้อมูลเดิมก่อน
  await prisma.ingredient.deleteMany({});

  for (const item of sampleIngredients) {
    await prisma.ingredient.create({
      data: item
    });
  }

  const count = await prisma.ingredient.count();
  console.log(`✅ Seed ข้อมูลสำเร็จ! มีวัตถุดิบทั้งหมด ${count} รายการในฐานข้อมูล.`);
}

main()
  .catch((e) => {
    console.error('❌ Error ในการ Seed ข้อมูล:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
