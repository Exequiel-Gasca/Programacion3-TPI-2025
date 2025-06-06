import { Router } from "express";
import {
  createServices,
  listServices,
  deleteService,
  updateService,
} from "../services/barberservices.services.js";

const router = Router();

router.get("/nuestrosservicios", listServices);

router.post("/nuestrosservicios", createServices);

router.delete("/nuestrosservicios/:id", deleteService);

router.put("/nuestrosservicios/:id", updateService);

export default router;
