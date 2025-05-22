import { Router } from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
} from "../services/user.services.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/login/admin", loginAdmin);

export default router;
