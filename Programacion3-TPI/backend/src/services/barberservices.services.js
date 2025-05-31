import jwt from "jsonwebtoken";
import Barberservice from "../models/Barberservice.js";
import { secretKey } from "../config.js";

export const createServices = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .send({ message: "No tenés permisos para crear servicios" });
    }

    const { serviceType, price } = req.body;

    const newService = await Barberservice.create({ serviceType, price });

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error verificando token:", error.message);
    return res.status(401).send({ message: error.message });
  }
};

export const listServices = async (req, res) => {
  try {
    const services = await Barberservice.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios" });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Barberservice.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    await service.destroy();
    return res.status(200).json({ message: "Servicio eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar el servicio" });
  }
};
