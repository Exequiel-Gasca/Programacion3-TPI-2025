import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./User.js";
import Barberservice from "./Barberservice.js";

const Appointment = sequelize.define("appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

Appointment.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

User.hasMany(Appointment, { foreignKey: "userId" });

Appointment.belongsTo(Barberservice, {
  foreignKey: {
    name: "barberserviceId",
    allowNull: false,
  },
});
Barberservice.hasMany(Appointment, { foreignKey: "barberserviceId" });

export default Appointment;
