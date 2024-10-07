import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { testConnection } from "./db/config/config.db";
import { loadModels } from "./db/modelLoader/modelLoader";
import errorHandler from "./middleware/errorHandler";

import { router } from "./routes/index";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.use(cookieParser());

testConnection()
  .then(() => {
    return loadModels();
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`));
  })
  .catch((error) => {
    console.error(
      "No se pudo iniciar el servidor debido a un error de conexión:",
      error
    );
  });
