import AuthService from "../services/user/auth.services";
import Users from "../db/models/user.model";
import { UserType } from "../db/models/utils/user.types";
import Coach from "../db/models/coach.models";
import Client from "../db/models/client.models";
import clientServices from "../services/client/client.services";
class LoginBestWayController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            // Buscar el usuario por su correo electrónico, seleccionando solo los campos necesarios
            const user = await Users.findOne({
                where: { email },
                attributes: [
                    "id",
                    "username",
                    "password",
                    "email",
                    "state",
                    "userType",
                ],
            });
            // Validar si el usuario existe y evitar la consulta redundante a la BD
            if (!user) {
                // Error específico para credenciales incorrectas
                return res.status(401).json({
                    status: 401,
                    message: "Credenciales incorrectas",
                });
            }
            // Comparar las contraseñas
            try {
                const isMatch = await AuthService.comparePasswords(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        status: 401,
                        message: "Credenciales incorrectas",
                    });
                }
            }
            catch (error) {
                return res.status(401).json({
                    status: 401,
                    message: "Credenciales incorrectas",
                });
            }
            let additionalData = null;
            if (user.userType === UserType.COACH) {
                additionalData = await Coach.findOne({ where: { user_id: user.id } });
            }
            if (user.userType === UserType.CLIENT) {
                additionalData = await Client.findOne({ where: { user_id: user.id } });
            }
            // buscar si los campos están llenos, si están vacíos enviar false
            const clientexist = await clientServices.getfilledFilledByUserId(user.id);
            // Generar el token
            const token = AuthService.generateToken(user.id);
            // Configurar la cookie con el token
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            // Responder con los datos del usuario y el token
            return res.status(200).json({
                message: "Usuario logeado exitosamente",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    state: user.state,
                    userType: user.userType,
                    additionalData,
                },
                infoClientRegistered: clientexist,
            });
        }
        catch (error) {
            // Log de error para ver qué está pasando
            console.error("Error en el login:", error);
            // Si el error es un problema inesperado, devolver un 500
            return res.status(500).json({
                status: 500,
                message: (error instanceof Error ? error.message : "Error desconocido") ||
                    "Error interno del servidor",
            });
        }
    }
}
export default new LoginBestWayController();
