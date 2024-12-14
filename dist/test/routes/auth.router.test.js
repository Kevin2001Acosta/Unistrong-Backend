import request from "supertest";
import { app } from "../../app"; // Asegúrate de que app esté configurado correctamente
import AuthService from "../../services/user/auth.services";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
// Mock de dependencias
jest.mock("../../services/user/auth.services");
jest.mock("../../db/models/user.model");
describe("Auth Routes", () => {
    const mockUser = {
        id: 1,
        email: "testuser@example.com",
        username: "testuser",
        password: "hashedPassword",
        state: true,
        userType: UserType.CLIENT,
    };
    beforeAll(() => {
        console.log = jest.fn(); // Desactiva los logs de consola
    });
    // Test para la ruta POST /login
    it("POST /user/login - Inicia sesión con credenciales válidas", async () => {
        Users.findOne.mockResolvedValue(mockUser);
        AuthService.comparePasswords.mockResolvedValue(true);
        AuthService.generateToken.mockReturnValue("validToken");
        const response = await request(app).post("/user/login ").send({
            email: mockUser.email,
            password: "ValidPassword123!", // La contraseña válida
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Usuario logeado exitosamente");
        expect(response.body.token).toBe("validToken");
        expect(response.body.user).toEqual({
            id: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            state: mockUser.state,
            userType: mockUser.userType,
        });
    });
    it("POST /user/login  - Retorna 401 si las credenciales son incorrectas", async () => {
        Users.findOne.mockResolvedValue(mockUser);
        AuthService.comparePasswords.mockResolvedValue(false); // Contraseña incorrecta
        const response = await request(app).post("/user/login ").send({
            email: mockUser.email,
            password: "WrongPassword123!", // Contraseña incorrecta
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credenciales incorrectas");
    });
    it("POST /user/login - Retorna 401 si el usuario no existe", async () => {
        Users.findOne.mockResolvedValue(null); // Usuario no encontrado
        const response = await request(app).post("/user/login").send({
            email: "nonexistent@example.com",
            password: "AnyPassword123!",
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credenciales incorrectas");
    });
    // Test para la ruta POST /logout
    it("POST /user/logout  - Desloguea al usuario correctamente", async () => {
        // Simula que el token es válido
        AuthService.verifyToken.mockReturnValue({ id: mockUser.id });
        const response = await request(app)
            .post("/user/logout")
            .set("Cookie", "token=validToken"); // Envia el token en la cookie
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Usuario deslogeado exitosamente");
    });
    it("POST /user/logout  - Retorna 403 si no se proporciona un token", async () => {
        const response = await request(app).post("/user/logout");
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Token no proporcionado");
    });
    it("POST /user/logout  - Retorna 401 si el token es inválido", async () => {
        // Simula un error al verificar el token
        AuthService.verifyToken.mockImplementation(() => {
            throw new Error("Token inválido o expirado");
        });
        const response = await request(app)
            .post("/user/logout ")
            .set("Cookie", "token=invalidToken");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token inválido o expirado");
    });
    it("GET /user/verify  - Retorna 403 si no se proporciona un token", async () => {
        const response = await request(app).get("/user/verify ");
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Token no proporcionado");
    });
    it("GET /user/verify  - Retorna 401 si el token es inválido", async () => {
        // Simula un error al verificar el token
        AuthService.verifyToken.mockImplementation(() => {
            throw new Error("Token inválido o expirado");
        });
        const response = await request(app)
            .get("/user/verify ")
            .set("Cookie", "token=invalidToken");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token inválido o expirado");
    });
});
