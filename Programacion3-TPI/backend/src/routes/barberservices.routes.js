import { Router } from "express";
import {
  createServices,
  listServices,
  deleteService,
} from "../services/barberservices.services.js";

const router = Router();

router.get("/nuestrosservicios", listServices);

router.post("/nuestrosservicios", createServices);

router.delete("/nuestrosservicios/:id", deleteService);

export default router;
