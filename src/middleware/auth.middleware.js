"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const auth_services_1 = __importDefault(require("../services/user/auth.services"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }
    try {
        const decoded = auth_services_1.default.verifyToken(token); // Verifica el token
        req.body.userId = decoded.id; // Asigna el ID del usuario al request
        next(); // Si el token es válido, continúa
    }
    catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
exports.verifyToken = verifyToken;
