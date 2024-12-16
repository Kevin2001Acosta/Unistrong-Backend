"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require("cookie-parser");
const config_db_1 = require("./db/config/config.db");
const modelLoader_1 = require("./db/modelLoader/modelLoader");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const index_1 = require("./routes/index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
exports.app = app;
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(cookieParser());
app.use(index_1.router);
app.use(errorHandler_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, config_db_1.testConnection)();
            yield (0, modelLoader_1.loadModels)();
            app.listen(PORT, () => {
                console.log(`Servidor escuchando en el puerto ${PORT}`);
            });
        }
        catch (error) {
            console.error("No se pudo iniciar el servidor debido a un error de conexión:", error);
        }
    });
}
startServer();
