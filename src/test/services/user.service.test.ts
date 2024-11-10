import UserService from "../../services/user/user.services";
import AuthService from "../../services/user/auth.services";
import { UniqueConstraintError } from "sequelize";
import Users from "../../db/models/user.model";
import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
import { UserType } from "../../db/models/utils/user.types";
jest.mock("../../services/user/auth.services");
jest.mock("../../db/models/user.model");

//Test para crear un usuarios usando el servicio createUser()
describe("UserService.createUser", () => {
  const mockUserInput: UserInput = {
    email: "juannicolas@example.com",
    name: "Juan Nicolas",
    dni: "12345678",
    username: "juanNiko",
    password: "StrongPassword123!",
    phoneNumber: "1234567890",
  };

  it("Crear un usuario correctamente", async () => {
    // Mock de hashPassword
    (AuthService.hashPassword as jest.Mock).mockResolvedValue("hashedPassword");

    // Mock de Users.create para simular un usuario creado
    (Users.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...mockUserInput,
      password: "hashedPassword",
    });

    const result = await UserService.createUser(mockUserInput);

    expect(result).toEqual({
      id: 1,
      ...mockUserInput,
      password: "hashedPassword",
    });
  });

  it("Lanzar error si la contraseña es débil", async () => {
    await expect(
      UserService.createUser({ ...mockUserInput, password: "123" })
    ).rejects.toThrow(
      "Error al crear el usuario: La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial"
    );
  });

  it("Lanzar error si el nombre de usuario es inválido", async () => {
    await expect(
      UserService.createUser({ ...mockUserInput, username: "invalido%" })
    ).rejects.toThrow(
      "Error al crear el usuario: El nombre de usuario debe comenzar con una letra, no puede comenzar con un número o carácter especial y debe tener almenos caracteres"
    );
  });

  it("Lanzar error si el correo electrónico ya está registrado", async () => {
    const error = new UniqueConstraintError({
      parent: { constraint: "users_email_key" },
    } as any);

    (Users.create as jest.Mock).mockRejectedValue(error);

    await expect(UserService.createUser(mockUserInput)).rejects.toThrow(
      "El correo electrónico ya está registrado"
    );
  });
});

//Test para el obtener todos los usuarios usando el servicio getAllUsers()
describe("UserService.getAllUsers", () => {
  it("Retornar lista de usuarios cuando hay usuarios en la base de datos", async () => {
    const mockUsers: UserAtributes[] = [
      {
        id: 1,
        email: "juannicolas@example.com",
        name: "juan nicolas",
        dni: "12345678",
        username: "juanNiko",
        password: "StrongPassword123!",
        phoneNumber: "1234567890",
        state: true,
        userType: UserType.CLIENT,
      },
    ];
    (Users.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const result = await UserService.getAllUsers();

    expect(result).toEqual(mockUsers);
  });
});

it("Retorna un array vacío cuando no hay usuarios en la base de datos", async () => {
  // Simula `Users.findAll` devolviendo un array vacío
  (Users.findAll as jest.Mock).mockResolvedValue([]);

  const result = await UserService.getAllUsers();

  expect(result).toEqual([]);
});

it("Lanzar un error si ocurre un problema al obtener los usuarios", async () => {
  const errorMessage = "Database connection error";
  (Users.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

  await expect(UserService.getAllUsers()).rejects.toThrow(
    `Error al obtener usuarios: ${errorMessage}`
  );
});

//Test para el obtener un usuario dado su ID usando el servicio getUserById()
describe("UserService.getUserById", () => {
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

  it("Devolver un usuario por su ID", async () => {
    // Simula `Users.findByPk` devolviendo un usuario
    (Users.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserService.getUserById(mockUser.id);

    expect(result).toEqual(mockUser);
  });

  it("Lanzar un error cuando el usuario no se encuentra", async () => {
    // Simula `Users.findByPk` devolviendo null
    (Users.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(UserService.getUserById(2)).rejects.toThrow(
      "Usuario no encontrado"
    );
  });

  it("Lnzar un error si ocurre un problema al buscar el usuario", async () => {
    const errorMessage = "Database connection error";
    (Users.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(UserService.getUserById(1)).rejects.toThrow(
      `Error al obtener el usuario: ${errorMessage}`
    );
  });
});
