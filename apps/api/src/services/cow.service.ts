import { prisma } from "../utils/prisma";
import { CowStatus } from "@prisma/client";

export function createCow(userId: string, alias: string, tagNumber: string, groupId?: string) {
  return prisma.cow.create({
    data: {
      alias,
      tagNumber,
      user: { connect: {id: userId} },
      group: groupId ? { connect: { id: groupId } } : undefined,
    },
    select: { id: true, alias: true, tagNumber: true, status: true },
  });
}

export function listCows(userId: string, groupId?: string) {
  return prisma.cow.findMany({
    where: { 
      userId,
      ...(groupId && { groupId })
    },
    select: { 
      id: true,
      alias: true,
      tagNumber: true,
      status: true,
      groupId: true
    },
  });
}

export function updateCow(id: string, data: Partial<{ alias: string; groupId: string; status: CowStatus }>) {
  return prisma.cow.update({
    where: { id },
    data,
    select: { id: true, alias: true, tagNumber: true, status: true },
  });
}

export function softDeleteCow(id: string) {
  return prisma.cow.update({
    where: { id },
    data: { status: "INACTIVE" },
    select: { id: true, status: true },
  });
}
