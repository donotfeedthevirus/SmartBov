import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { requireDeviceOwner } from "../middlewares/ownership";
import { validate } from "../utils/validate";
import { z } from "zod";
import * as DevCtrl from "../controllers/device.controller";

const r = Router();
r.use(authenticate, requireRole("USER"));

const registerSchema = z.object({
  serial: z.string(),
  firmware: z.string(),
});
r.post("/", validate(registerSchema), DevCtrl.register);
r.get("/", DevCtrl.list);

r.patch("/:id/attach/:cowId", requireDeviceOwner(), DevCtrl.attach);
r.delete("/:id", requireDeviceOwner(), DevCtrl.remove);

export { r as deviceRouter };
