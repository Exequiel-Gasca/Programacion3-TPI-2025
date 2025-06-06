import jwt from "jsonwebtoken";
import Barberservice from "../models/Barberservice.js";
import { secretKey } from "../config.js";
import { sequelize } from "../db.js";

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

    const existing = await Barberservice.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("serviceType")),
        serviceType.toLowerCase()
      ),
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya existe un servicio con ese nombre" });
    }

    const newService = await Barberservice.create({ serviceType, price });

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error verificando token o creando servicio:", error.message);
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

export const updateService = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.role !== "admin") {
      return res.status(403).send({ message: "No tenés permisos para editar servicios" });
    }

    const { id } = req.params;
    const { serviceType, price } = req.body;

    const service = await Barberservice.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    service.serviceType = serviceType;
    service.price = price;
    await service.save();

    res.status(200).json(service);
  } catch (error) {
    console.error("Error al editar el servicio:", error);
    res.status(500).json({ message: "Error interno al editar el servicio" });
  }
};