import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./User.js";
import Barberservice from "./Barberservice.js";

const Turns = sequelize.define("Turns", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterToday(value) {
        const today = new Date().toISOString().split("T")[0];
        if (value < today) {
          throw new Error("La fecha no puede ser en el pasado.");
        }
      },
    },
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Turns.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

User.hasMany(Turns, { foreignKey: "userId" });

Turns.belongsTo(Barberservice, {
  foreignKey: {
    name: "barberserviceId",
    allowNull: false,
  },
});
Barberservice.hasMany(Turns, { foreignKey: "barberserviceId" });

export default Turns;
