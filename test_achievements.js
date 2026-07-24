const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const achievements = await prisma.achievement.findMany();
  console.log(achievements);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
