import express from "express";
import { sequelize } from "./db.js";
import { PORT } from "./config.js";
import turnsRoutes from "./routes/turns.routes.js";
import barberserviceRoutes from "./routes/barberservices.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./models/Turns.js";
import "./models/Barberservice.js";
import "./models/User.js";

const app = express();

try {
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
  });
  app.listen(PORT);
  app.use(turnsRoutes);
  app.use(userRoutes);
  app.use(barberserviceRoutes);

  await sequelize.sync();

  console.log(`Server listening on port ${PORT}`);
} catch (error) {
  console.log(`Ocurrio un error en el inicio`);
}
