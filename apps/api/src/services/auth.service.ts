import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { User, UserRole } from "@prisma/client";

export async function hashPassword(raw: string) {
  return bcrypt.hash(raw, 10);
}

export async function createUser(email: string, password: string, role: UserRole = "USER") {
  const hashed = await hashPassword(password);
  return prisma.user.create({
    data: { email, password: hashed, role },
    select: { id: true, email: true, role: true },
  });
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

export function signJwt(user: Pick<User, "id" | "role">) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}
