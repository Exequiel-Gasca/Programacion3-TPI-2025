import jwt from "jsonwebtoken";
import Turns from "../models/Turns.js";
import User from "../models/User.js";
import Barberservice from "../models/Barberservice.js";
import { secretKey } from "../config.js";

export const createTurn = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const { date, time, barberserviceId } = req.body;

    const existingTurn = await Turns.findOne({
      where: { date, time },
    });

    if (existingTurn) {
      return res.status(400).json({
        message: "Ya hay un turno reservado en esa fecha y hora",
      });
    }

    const newTurn = await Turns.create({
      date,
      time,
      userId,
      barberserviceId,
    });

    res.status(201).json(newTurn);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Error al crear el turno" });
  }
};

export const listTurns = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);

    let turns;
    if (decoded.role === "admin") {
      turns = await Turns.findAll({ include: [User, Barberservice] });
    } else {
      turns = await Turns.findAll({
        where: { userId: decoded.id },
        include: [Barberservice],
      });
    }

    res.json(turns);
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const getTurnById = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);
    const { id } = req.params;

    const turn = await Turns.findByPk(id, {
      include: [User, Barberservice],
    });

    if (!turn) return res.status(404).json({ message: "No hay turnos" });

    if (decoded.role !== "admin" && turn.userId !== decoded.id) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para ver este turno" });
    }

    res.json(turn);
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const updateTurn = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);
    const { id } = req.params;
    const { date, time, barberserviceId } = req.body;

    const turn = await Turns.findByPk(id);
    if (!turn) return res.status(404).json({ message: "Turno no encontrado" });

    if (decoded.role !== "admin" && turn.userId !== decoded.id) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para actualizar este turno" });
    }

    await turn.update({ date, time, barberserviceId });

    res.json(turn);
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const deleteTurn = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);
    const { id } = req.params;

    const turn = await Turns.findByPk(id);
    if (!turn) return res.status(404).json({ message: "Turno no encontrado" });

    if (decoded.role !== "admin" && turn.userId !== decoded.id) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para eliminar este turno" });
    }

    await turn.destroy();

    res.json({ message: "Turno eliminado con éxito" });
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
