import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { UserRoles } from "../enums/enums.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
  nroTel: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^\d{10}$/,
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.ENUM(Object.values(UserRoles)),
    allowNull: false,
    defaultValue: UserRoles.USER,
  },
});

export default User;
