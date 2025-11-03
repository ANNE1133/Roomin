// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default prisma;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// ✅ เพิ่ม graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;