import { Router } from "express";
import {
  loginUser,
  registerUser,
  deleteUserAccount,
} from "../services/user.services.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.delete("/delete/:id", deleteUserAccount);

export default router;
