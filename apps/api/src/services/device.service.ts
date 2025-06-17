import { prisma } from "../utils/prisma";

export function registerDevice(userId: string, serial: string, firmware: string) {
  return prisma.device.create({
    data: {
      serial,
      firmware,
      user: { connect: { id: userId } }
    },
    select: { id: true, serial: true, firmware: true },
  });
}

export function listDevices(userId: string) {
  return prisma.device.findMany({
    where: { userId },
    select: { id: true, serial: true, firmware: true, lastSeen: true, battery: true },
  });
}

export function attachDevice(deviceId: string, cowId: string) {
  return prisma.device.update({
    where: { id: deviceId },
    data: { cow: { connect: { id: cowId } } },
    select: { id: true, serial: true, cow: { select: { id: true, alias: true } } },
  });
}

export function deleteDevice(deviceId: string) {
  return prisma.device.delete({ where: { id: deviceId } });
}
