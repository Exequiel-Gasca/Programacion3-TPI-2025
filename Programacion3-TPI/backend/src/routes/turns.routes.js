import { Router } from "express";
import {
  createTurn,
  listTurns,
  getTurnById,
  updateTurn,
  deleteTurn,
} from "../services/turns.services.js";
const router = Router();

router.post("/turnos", createTurn);

router.get("/turnos", listTurns);

router.get("/turnos/:id", getTurnById);

router.put("/turnos/:id", updateTurn);

router.delete("/turnos/:id", deleteTurn);

export default router;
