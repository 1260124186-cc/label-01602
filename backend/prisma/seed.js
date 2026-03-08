/**
 * 数据库种子脚本 (JavaScript 版本，用于 Docker 环境)
 * 用于初始化管理员账户和测试数据
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始播种数据库...');

  // 1. 创建管理员账户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rental.com' },
    update: {
      password: adminPassword,
      name: '系统管理员',
      role: 'admin',
    },
    create: {
      email: 'admin@rental.com',
      password: adminPassword,
      name: '系统管理员',
      role: 'admin',
    },
  });
  console.log(`✅ 管理员账户已创建: ${admin.email}`);

  // 2. 创建测试用户
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@rental.com' },
    update: {
      password: userPassword,
      name: '测试用户',
      role: 'user',
    },
    create: {
      email: 'test@rental.com',
      password: userPassword,
      name: '测试用户',
      role: 'user',
    },
  });
  console.log(`✅ 测试用户已创建: ${testUser.email}`);

  // 3. 创建示例房源数据
  const sampleListings = [
    {
      title: '学府路精装两室 近地铁 适合学生合租',
      rent: 2500,
      address: '北京市海淀区学府路88号',
      rentType: 'shared',
      area: 75,
      floor: 5,
      tags: ['近地铁', '精装修', '有空调', '独卫'],
      description: '房源紧邻地铁站，步行5分钟即达。周边有多所高校，生活便利，适合学生合租。房间采光好，家具家电齐全。',
      status: 'approved',
      userId: testUser.id,
    },
    {
      title: '大学城一室一厅 整租 拎包入住',
      rent: 1800,
      address: '北京市昌平区大学城西路66号',
      rentType: 'whole',
      area: 45,
      floor: 3,
      tags: ['整租', '拎包入住', '有暖气'],
      description: '位于大学城核心区域，周边配套完善。一室一厅，适合单身或情侣居住。',
      status: 'approved',
      userId: testUser.id,
    },
    {
      title: '五道口次卧出租 限女生',
      rent: 1200,
      address: '北京市海淀区五道口华清嘉园',
      rentType: 'shared',
      area: 12,
      floor: 8,
      tags: ['近地铁', '限女生', '有空调'],
      description: '三室一厅中的次卧，室友均为附近高校研究生女生。',
      status: 'pending',
      userId: testUser.id,
    },
    {
      title: '中关村科技园区单间',
      rent: 2000,
      address: '北京市海淀区中关村南大街',
      rentType: 'shared',
      area: 18,
      floor: 10,
      tags: ['近地铁', '电梯房', '有空调'],
      description: '位于中关村科技园区，交通便利，适合在附近工作或学习的朋友。',
      status: 'rejected',
      rejectReason: '信息不完整，请补充房源照片',
      userId: testUser.id,
    },
  ];

  // 清除旧的测试数据
  await prisma.listing.deleteMany({
    where: { userId: testUser.id },
  });

  for (const listing of sampleListings) {
    await prisma.listing.create({
      data: listing,
    });
  }
  console.log(`✅ 已创建 ${sampleListings.length} 条示例房源`);

  console.log('🎉 数据库播种完成！');
  console.log('\n📋 测试账户信息:');
  console.log('  管理员: admin@rental.com / admin123');
  console.log('  用户: test@rental.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ 播种失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
