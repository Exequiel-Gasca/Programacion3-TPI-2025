import { Router } from "express";
import {
  loginUser,
  registerUser,
  deleteUserAccount,
  updateUserByAdmin,
  getUsers,
  getCurrentUser,
  updateMe,
} from "../services/user.services.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.delete("/delete/:id", deleteUserAccount);

router.put("/update/:id", updateUserByAdmin);

router.get("/get", getUsers);

router.get("/me", getCurrentUser);

router.put("/me", updateMe);

export default router;
