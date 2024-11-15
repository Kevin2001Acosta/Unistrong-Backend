import { Request, Response, NextFunction } from "express";
import LoginBestWayController from "../../controllers/loginBestWay.controller";
import AuthService from "../../services/user/auth.services";
import Users from "../../db/models/user.model";
import createError from "http-errors";

jest.mock("../../services/user/auth.services");
jest.mock("../../db/models/user.model");

describe("LoginBestWayController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("login", () => {
    it("Debe retornar un estado 200, un token y los datos del usuario si las credenciales son correctas", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedpassword",
        state: true,
        userType: "CLIENT",
      };
      const token = "testtoken";

      mockReq = {
        body: { email: "testuser@example.com", password: "password123" },
      };

      // Mock de la consulta a la base de datos y validación de la contraseña
      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (AuthService.generateToken as jest.Mock).mockReturnValue(token);

      await LoginBestWayController.login(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.cookie).toHaveBeenCalledWith("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Usuario logeado exitosamente",
        token,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          state: mockUser.state,
          userType: mockUser.userType,
        },
      });
    });

    it("Debe retornar un estado 401 si el usuario no existe", async () => {
      mockReq = {
        body: { email: "unknown@example.com", password: "password123" },
      };

      (Users.findOne as jest.Mock).mockResolvedValue(null);

      await LoginBestWayController.login(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 401,
        message: "Credenciales incorrectas",
      });
    });

    it("Debe retornar un estado 401 si la contraseña es incorrecta", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedpassword",
      };

      mockReq = {
        body: { email: "testuser@example.com", password: "wrongpassword" },
      };

      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.comparePasswords as jest.Mock).mockResolvedValue(false);

      await LoginBestWayController.login(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 401,
        message: "Credenciales incorrectas",
      });
    });

    it("Debe retornar un estado 500 en caso de error del servidor", async () => {
      mockReq = {
        body: { email: "testuser@example.com", password: "password123" },
      };

      (Users.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

      await LoginBestWayController.login(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 500,
        message: "DB error",
      });
    });

    it("Debe retornar un estado 401 si el servicio de comparación de contraseñas falla", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedpassword",
      };

      mockReq = {
        body: { email: "testuser@example.com", password: "password123" },
      };

      // Simulamos que el servicio de comparación de contraseñas falla
      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.comparePasswords as jest.Mock).mockRejectedValue(
        new Error("Error al comparar contraseñas")
      );

      await LoginBestWayController.login(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 401,
        message: "Credenciales incorrectas",
      });
    });
  });
});
