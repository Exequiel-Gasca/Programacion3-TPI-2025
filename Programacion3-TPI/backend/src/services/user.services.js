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

export const updateUserByAdmin = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== UserRoles.ADMIN) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: solo para admins" });
    }

    const { id } = req.params;
    const { name, lastName, nroTel, email, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (name !== undefined) user.name = name;
    if (lastName !== undefined) user.lastName = lastName;
    if (nroTel !== undefined) user.nroTel = nroTel;
    if (email !== undefined) user.email = email;
    if (role !== undefined) {
      if (!Object.values(UserRoles).includes(role)) {
        return res.status(400).json({ message: "Rol inválido." });
      }
      user.role = role;
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const getUsers = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== UserRoles.ADMIN) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: solo para admins" });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const getCurrentUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      nroTel: user.nroTel,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const updateMe = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const { name, lastName, nroTel, email, currentPassword, newPassword } =
      req.body;

    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (nroTel) user.nroTel = nroTel;

    if (email) {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser && existingUser.id !== user.id) {
        return res
          .status(400)
          .json({ message: "Ese email ya está registrado por otro usuario." });
      }

      user.email = email;
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message:
            "Debes proporcionar tanto la contraseña actual como la nueva.",
        });
      }

      const validatePassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!validatePassword.test(newPassword)) {
        return res.status(400).json({
          message:
            "La nueva contraseña debe tener al menos 8 caracteres, incluir una letra y un número.",
        });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Contraseña actual incorrecta." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
    }

    await user.save();

    return res.json({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      nroTel: user.nroTel,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};
