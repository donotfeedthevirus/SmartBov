import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@smartbov.dev" },
    update: {},
    create: {
      email: "admin@smartbov.dev",
      password: hash,
      role: "ADMIN",         // ← NEW
      ranchName: "Demo Ranch"
    }
  });
}

main().finally(() => prisma.$disconnect());
