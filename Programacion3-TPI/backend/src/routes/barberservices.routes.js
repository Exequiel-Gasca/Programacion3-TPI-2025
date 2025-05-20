import { Router } from "express";
import {
  createServices,
  listServices,
} from "../services/barberservices.services.js";

const router = Router();

router.get("/nuestrosservicios", listServices);

router.post("/nuestrosservicios", createServices);

export default router;
