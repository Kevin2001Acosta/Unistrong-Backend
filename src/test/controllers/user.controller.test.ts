import { Request, Response, NextFunction } from "express";
import userController from "../../controllers/user.controller";
import UserService from "../../services/user/user.services";
import { UserAtributes } from "../../schemas/user/user.schema";
import createError from "http-errors";
import { UserType } from "../../db/models/utils/user.types";

jest.mock("../../services/user/user.services");

describe("UserController.createUser", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockUser: UserAtributes = {
    id: 1,
    email: "juannicolas@example.com",
    name: "juan nicolas",
    dni: "12345678",
    username: "juanNiko",
    password: "StrongPassword123!",
    phoneNumber: "1234567890",
    state: true,
    userType: UserType.CLIENT,
  };

  beforeEach(() => {
    mockReq = {
      body: {
        email: "juannicolas@example.com",
        name: "juan nicolas",
        dni: "12345678",
        username: "juanNiko",
        password: "StrongPassword123!",
        phoneNumber: "1234567890",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("Retorna estado 201 y el usuario creado en JSON si fue exitoso", async () => {
    (UserService.createUser as jest.Mock).mockResolvedValue(mockUser);

    await userController.createUser(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockUser);
  });

  it("Retorna un error a la función next con un estado 400 en caso de fallo", async () => {
    const errorMessage = "Error al crear usuario";
    (UserService.createUser as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await userController.createUser(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(createError(400, errorMessage));
  });
});

// Test para obtener todos los usuarios usando el controlador getAllUsers()
describe("UserController.getAllUsers", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockUsers: UserAtributes[] = [
    {
      id: 1,
      email: "juannicolas@example.com",
      name: "Juan Nicolas",
      dni: "12345678",
      username: "juanNiko",
      password: "StrongPassword123!",
      phoneNumber: "1234567890",
      state: true,
      userType: UserType.CLIENT,
    },
    {
      id: 2,
      email: "maria@example.com",
      name: "Maria Garcia",
      dni: "87654321",
      username: "mariaG",
      password: "StrongPassword123!",
      phoneNumber: "0987654321",
      state: true,
      userType: UserType.ADMIN,
    },
  ];

  beforeEach(() => {
    mockReq = {}; // Este test no requiere parámetros en el request

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("Retorna estado 200 y una lista de usuarios si es exitoso", async () => {
    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    await userController.getAllUsers(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
  });

  it("Retorna un error a la función next con un estado 400 si ocurre un error", async () => {
    const errorMessage = "Error al obtener usuarios";

    (UserService.getAllUsers as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await userController.getAllUsers(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(createError(400, errorMessage));
  });
});

// Test para obtener un usuario dado su ID usando el controlador getUserById()
describe("UserController.getUserById", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockUser: UserAtributes = {
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

  beforeEach(() => {
    mockReq = {
      params: {
        id: "1",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("Retorna estado 200 y el usuario encontrado si es exitoso", async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    await userController.getUserById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUser);
  });

  it("Retorna un error a la función next con un estado 404 si el usuario no se encuentra", async () => {
    const errorMessage = "Usuario no encontrado";

    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

    await userController.getUserById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(createError(404, errorMessage));
  });

  it("Retorna un error a la función next con un estado 400 en caso de error en la base de datos", async () => {
    const errorMessage = "Error al obtener el usuario";

    (UserService.getUserById as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await userController.getUserById(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(createError(400, errorMessage));
  });
});
