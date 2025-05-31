import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Barberservice = sequelize.define("Barberservice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

export default Barberservice;
