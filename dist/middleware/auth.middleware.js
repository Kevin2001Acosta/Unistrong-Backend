import AuthService from "../services/user/auth.services";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }
    try {
        const decoded = AuthService.verifyToken(token); // Verifica el token
        req.body.userId = decoded.id; // Asigna el ID del usuario al request
        next(); // Si el token es válido, continúa
    }
    catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
