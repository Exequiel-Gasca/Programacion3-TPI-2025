import jwt from "jsonwebtoken";
import Barberservice from "../models/Barberservice.js";

const ADMIN_EMAIL = "admin@peluqueria.com";
const secretKey = "programacion3-2025";

export const createServices = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.email !== ADMIN_EMAIL) {
      return res
        .status(403)
        .send({ message: "No tenés permisos para crear servicios" });
    }

    const { name, price } = req.body;

    const newService = await Barberservice.create({ name, price });

    res.status(201).json(newService);
  } catch (error) {
    return res.status(401).send({ message: "Token inválido o expirado" });
  }
};

export const listServices = async (req, res) => {
  const services = await Barberservice.findAll();
  res.json(services);
};
