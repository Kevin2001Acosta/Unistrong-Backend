import request from "supertest";
import { app } from "../../app";
import UserService from "../../services/user/user.services";
import { UserType } from "../../db/models/utils/user.types";
jest.mock("../../services/user/user.services");
describe("User Routes", () => {
    const mockUser = {
        id: 1,
        email: "juannicolas@example.com",
        name: "Juan Nicolas",
        dni: "12345678",
        username: "juanNiko",
        password: "StrongPassword123!",
        phoneNumber: "1234567890",
        state: true,
        userType: UserType.CLIENT,
    };
    beforeAll(() => {
        console.log = jest.fn(); // Esto desactiva los logs de consola
    });
    // Test para la ruta POST /users/register
    it("POST /user/register - Crea un nuevo usuario", async () => {
        UserService.createUser.mockResolvedValue(mockUser);
        const response = await request(app).post("/user/register").send({
            email: "juannicolas@example.com",
            name: "Juan Nicolas",
            dni: "12345678",
            username: "juanNiko",
            password: "StrongPassword123!",
            phoneNumber: "1234567890",
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });
    // Test para la ruta GET /users
    it("GET /user - Obtiene todos los usuarios", async () => {
        const mockUsers = [mockUser];
        UserService.getAllUsers.mockResolvedValue(mockUsers);
        const response = await request(app).get("/user/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
    });
    // Test para la ruta GET /users/:id
    it("GET /user/:id - Obtiene un usuario por ID", async () => {
        const mockUserById = mockUser;
        UserService.getUserById.mockResolvedValue(mockUserById);
        const response = await request(app).get("/user/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUserById);
    });
    // Test para la ruta GET /users/:id cuando no encuentra el usuario
    it("GET /user/:id - Retorna 404 si el usuario no es encontrado", async () => {
        const errorMessage = "Usuario no encontrado";
        UserService.getUserById.mockRejectedValue(new Error(errorMessage));
        const response = await request(app).get("/user/99"); // ID que no existe
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", errorMessage);
    });
});
