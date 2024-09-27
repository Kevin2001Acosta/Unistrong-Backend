import express from "express";
import cors from "cors";
import { testConnection } from "./db/config/config.db";
import { loadModels } from "./db/modelLoader/modelLoader";
import userRouter from "./routes/user.router";
import clientRouter from "./routes/client.router";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/client", clientRouter);

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
