import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./barber.db",
  define: {
    timestamps: false,
  },
});
