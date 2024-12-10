import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../db/config/config.auth";
class AuthService {
    async hashPassword(password) {
        try {
            const hash = await bcrypt.hash(password, 10);
            return hash;
        }
        catch (error) {
            throw new Error("Error al hashear la contraseña: " + error.message);
        }
    }
    async comparePasswords(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (error) {
            throw new Error("Error al comparar las contraseñas: " + error.message);
        }
    }
    // crear jwt
    generateToken(userId) {
        const token = jwt.sign({ id: userId }, config.jwtSecret, {
            expiresIn: "1h", // Token expira en 1 hora
        });
        return token;
    }
    //verificar token
    verifyToken(token) {
        return jwt.verify(token, config.jwtSecret);
    }
    generateTokenEmail(userId, code) {
        const token = jwt.sign({ id: userId, code: code }, config.jwtSecret, {
            expiresIn: "1h", // Token expira en 1 hora
        });
        return token;
    }
}
export default new AuthService();
