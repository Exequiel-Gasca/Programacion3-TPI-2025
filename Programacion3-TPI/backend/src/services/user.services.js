import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UserRoles } from "../enums/enums.js";
import { secretKey } from "../config.js";

export const registerUser = async (req, res) => {
  const { name, lastName, nroTel, password, email, role } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user) {
    return res
      .status(400)
      .send({ message: "Este email ya se encuentra registrado." });
  }

  if (!Object.values(UserRoles).includes(role)) {
    return res.status(400).json({ message: "Rol inválido." });
  }
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    lastName,
    nroTel,
    password: hashedPassword,
    email,
    role,
  });

  res.json(newUser.id);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(401).send({ message: "Usuario no existente" });

  const comparison = await bcrypt.compare(password, user.password);

  if (!comparison)
    return res.status(401).send({ message: "Email y/o contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secretKey,
    {
      expiresIn: "1h",
    }
  );

  return res.json({
    token,
    isAdmin: user.role === "admin",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const deleteUserAccount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token recibido:", token);

  if (!token) {
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Token decodificado:", decoded);

    const email = decoded.email;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();
    return res.status(200).json({ message: "Cuenta eliminada con éxito" });
  } catch (error) {
    console.error("Error JWT:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
