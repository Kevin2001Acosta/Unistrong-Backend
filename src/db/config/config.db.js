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
exports.sequelize = void 0;
exports.testConnection = testConnection;
const sequelize_1 = require("sequelize");
const config_env_1 = __importDefault(require("../config/config.env"));
const dbName = config_env_1.default.dbName || "";
const dbUser = config_env_1.default.dbUser || "";
const dbHost = config_env_1.default.dbHost || "";
console.log("dbHost", dbHost);
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, config_env_1.default.dbPassword, {
    ssl: false,
    host: dbHost,
    port: Number(config_env_1.default.dbPort),
    dialect: "postgres",
    dialectOptions: {
        ssl: false,
    },
    logging: false,
});
exports.sequelize = sequelize;
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log("Conexión establecida correctamente.");
        }
        catch (error) {
            console.error("No se pudo conectar a la base de datos:", error);
        }
    });
}
