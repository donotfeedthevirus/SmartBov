import { Request, Response } from "express";
import { attachDevice, deleteDevice, listDevices, registerDevice } from "../services/device.service";

export async function register(req: Request, res: Response) {
  const { serial, firmware } = req.body;
  const device = await registerDevice(req.user!.id, serial, firmware);
  res.status(201).json(device);
}

export async function list(req: Request, res: Response) {
  const devices = await listDevices(req.user!.id);
  res.json(devices);
}

export async function attach(req: Request, res: Response) {
  const { id, cowId } = req.params;
  const device = await attachDevice(id, cowId);
  res.json(device);
}

export async function remove(req: Request, res: Response) {
  await deleteDevice(req.params.id);
  res.status(204).end();
}
