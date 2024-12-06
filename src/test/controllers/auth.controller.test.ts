import { Request, Response, NextFunction } from "express";
import AuthController from "../../controllers/auth.controller";
import AuthService from "../../services/user/auth.services";
import UserService from "../../services/user/user.services";
import Users from "../../db/models/user.model";
import createError from "http-errors";
import { verifyToken } from "../../middleware/auth.middleware";

jest.mock("../../services/user/auth.services");
jest.mock("../../services/user/user.services");
jest.mock("../../db/models/user.model");

describe("AuthController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("login", () => {
    it("Debe retornar un estado 200, un token y los datos del usuario si las credenciales son correctas", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "gengis123@mail.com",
        password: "contraseña12A*",
        state: true,
        userType: "CLIENT",
      };

      const token = "testtoken";
      const additionalData = null; // Simular que no hay datos adicionales

      mockReq = {
        body: { email: "testuser@example.com", password: "password123" },
      };

      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (AuthService.generateToken as jest.Mock).mockReturnValue(token);

      await AuthController.login(mockReq as Request, mockRes as Response);

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
          additionalData, // Aquí estás simulando que es null
        },
      });
    });

    it("Debe retornar un estado 401 si el usuario no existe", async () => {
      mockReq = {
        body: { email: "unknown@example.com", password: "password123" },
      };

      (Users.findOne as jest.Mock).mockResolvedValue(null);

      await AuthController.login(mockReq as Request, mockRes as Response);

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

      await AuthController.login(mockReq as Request, mockRes as Response);

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

      await AuthController.login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 500,
        message: "Error interno del servidor",
      });
    });
  });

  describe("logout", () => {
    it("Debe limpiar la cookie de token y retornar un estado 200", async () => {
      await AuthController.logout(mockReq as Request, mockRes as Response);

      expect(mockRes.clearCookie).toHaveBeenCalledWith("token");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Usuario deslogeado exitosamente",
      });
    });
  });

  describe("verifyToken", () => {
    it("Debe retornar un estado 200 y los datos del usuario si el token es válido", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        state: true,
        userType: "CLIENT",
      };

      mockReq = {
        body: { userId: mockUser.id },
      };

      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await AuthController.verifyToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Token válido",
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          state: mockUser.state,
          userType: mockUser.userType,
        },
      });
    });

    it("Debe retornar un estado 404 si el usuario no se encuentra", async () => {
      mockReq = {
        body: { userId: 999 },
      };

      (UserService.getUserById as jest.Mock).mockResolvedValue(null);

      await AuthController.verifyToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });

    it("Debe retornar un estado 400 si hay un error en la verificación del token", async () => {
      mockReq = {
        body: { userId: 1 },
      };

      (UserService.getUserById as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await AuthController.verifyToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 400,
        message: "Hubo un problema al verificar el token",
      });
    });
  });
});

describe("verifyToken Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("Debe llamar a next si el token es válido", () => {
    const token = "validtoken";
    const decoded = { id: 1 };

    mockReq = {
      cookies: { token },
      body: {}, // Definimos body aquí
    };

    (AuthService.verifyToken as jest.Mock).mockReturnValue(decoded);

    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(AuthService.verifyToken).toHaveBeenCalledWith(token);
    expect(mockReq.body.userId).toEqual(decoded.id);
    expect(mockNext).toHaveBeenCalled();
  });

  it("Debe retornar un estado 403 si no se proporciona un token", () => {
    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Token no proporcionado",
    });
  });

  it("Debe retornar un estado 401 si el token es inválido o expirado", () => {
    const token = "invalidtoken";
    mockReq.cookies = { token };

    (AuthService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Token inválido o expirado");
    });

    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Token inválido o expirado",
    });
  });
});
