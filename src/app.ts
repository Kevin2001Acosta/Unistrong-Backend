import express from "express";
import cors from "cors";
import { testConnection } from "./db/config/config.db";
import { loadModels } from "./db/modelLoader/modelLoader";
import userRouter from "./routes/user/user.router";
import clientRouter from "./routes/client/client.router";
import coachRouter from "./routes/coach/coach.router";
import routinesRouter from "./routes/routines/routines.router";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // El origen de tu frontend (debe ser explícito)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Habilitar credenciales (cookies, autenticación)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/client", clientRouter);
app.use("/api/coach", coachRouter);
app.use("/api/routines", routinesRouter);

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
