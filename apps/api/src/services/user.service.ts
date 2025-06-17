import { prisma } from "../utils/prisma";
import { hashPassword } from "./auth.service";
import { UserRole } from "@prisma/client";

export async function createUserService(email: string, password: string, role: UserRole) {
  const hashed = await hashPassword(password);
  return prisma.user.create({
    data: { email, password: hashed, role },
    select: { id: true, email: true, role: true, isActive: true },
  });
}

export async function listUsersService(skip = 0, take = 20) {
  return prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, email: true, role: true },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserService(
  id: string,
  data: Partial<{ password: string; role: UserRole; ranchName: string }>
) {
  if (data.password) data.password = await hashPassword(data.password);
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true },
  });
}

export async function deleteUserService(id: string) {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, email: true },
  });
}
