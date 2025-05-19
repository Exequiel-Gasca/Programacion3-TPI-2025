import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, lastName, nroTel, password, email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user)
    return res
      .status(400)
      .send({ message: "Este email ya se encuentra registrado." });

  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    lastName,
    nroTel,
    password: hashedPassword,
    email,
  });

  res.json(newUser.id);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) return res.status(401).send({ message: "Usuario no existente" });

  const comparison = await bcrypt.compare(password, user.password);

  if (!comparison)
    return res.status(401).send({ message: "Email y/o contraseña incorrecta" });

  const secretKey = "programacion3-2025";

  const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

  return res.json(token);
};
