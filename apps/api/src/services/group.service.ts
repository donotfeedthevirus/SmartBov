import { prisma } from "../utils/prisma";

export function createGroup(userId: string, name: string) {
  return prisma.group.create({
    data: { name, user: { connect: { id: userId } } },
    select: { id: true, name: true }
  });
}

export function listGroups(userId: string) {
  return prisma.group.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true }
  });
}

export function renameGroup(id: string, name: string) {
  return prisma.group.update({
    where: { id },
    data: { name },
    select: { id: true, name: true }
  });
}

export async function deleteGroup(id: string) {
  const count = await prisma.cow.count({ where: { groupId: id, status: "ACTIVE" } });
  if (count > 0) throw new Error("Group has active cows");

  return prisma.group.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, isActive: true }
  });
}
