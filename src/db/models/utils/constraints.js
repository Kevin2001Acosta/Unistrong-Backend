"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrongPassword = exports.isValidUsername = void 0;
// Validación de nombre de usuario
const isValidUsername = (username) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,}$/;
    if (!regex.test(username)) {
        throw new Error("El nombre de usuario debe comenzar con una letra, no puede comenzar con un número o carácter especial y debe tener almenos caracteres");
    }
};
exports.isValidUsername = isValidUsername;
// Validación de contraseña
const isStrongPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
        throw new Error("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial");
    }
};
exports.isStrongPassword = isStrongPassword;
