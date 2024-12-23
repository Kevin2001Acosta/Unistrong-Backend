const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
import { testConnection } from "./db/config/config.db";
import { loadModels } from "./db/modelLoader/modelLoader";
import errorHandler from "./middleware/errorHandler";
import { router } from "./routes/index";
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorHandler);
export { app };
async function startServer() {
    try {
        await testConnection();
        await loadModels();
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    }
    catch (error) {
        console.error("No se pudo iniciar el servidor debido a un error de conexión:", error);
    }
}
startServer();
