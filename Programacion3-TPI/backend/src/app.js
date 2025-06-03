import express from "express";
import cors from "cors";
import { sequelize } from "./db.js";
import { PORT } from "./config.js";
import turnsRoutes from "./routes/turns.routes.js";
import barberserviceRoutes from "./routes/barberservices.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./models/Turns.js";
import "./models/Barberservice.js";
import "./models/User.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use(turnsRoutes);
app.use(userRoutes);
app.use(barberserviceRoutes);

try {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.log("Ocurrió un error al iniciar el servidor:", error);
}
