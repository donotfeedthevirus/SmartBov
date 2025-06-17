import { Router } from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { z } from "zod";
import { validate } from "../utils/validate";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
});
const updateSchema = z.object({
  password: z.string().min(6).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  ranchName: z.string().optional(),
});

router.post("/", validate(createSchema), createUser);
router.get("/", listUsers);
router.patch("/:id", validate(updateSchema), updateUser);
router.delete("/:id", deleteUser);

export { router as userRouter };
