// import RoutineService from "../../services/routines/routines.services";
// import Routines from "../../db/models/routines.models";
// import Client from "../../db/models/client.models";
// import ClientRoutines from "../../db/models/client_routines";
// import Coach from "../../db/models/coach.models";
// import Users from "../../db/models/user.model";
// import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
// import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";
// import { UserType } from "../../db/models/utils/user.types";

// jest.mock("../../db/models/routines.models", () => ({
//   create: jest.fn(),
//   findAll: jest.fn(),
//   findByPk: jest.fn(),
//   findOne: jest.fn(),
// }));

// jest.mock("../../db/models/client.models", () => ({
//   findByPk: jest.fn(),
//   findOne: jest.fn(),
// }));

// jest.mock("../../db/models/client_routines", () => ({
//   create: jest.fn(),
// }));

// jest.mock("../../db/models/coach.models", () => ({
//   findByPk: jest.fn(),
// }));

// jest.mock("../../db/models/user.model", () => ({
//   findOne: jest.fn(),
// }));

// describe("RoutineService", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("createRoutine", () => {
//     const mockRoutineData: RoutinesInput = {
//       name: "Rutina de fuerza",
//       coachId: 1,
//       description: "Rutina para aumentar la fuerza",
//       category: "Fuerza",
//       musclesWorked: ["Piernas", "Brazos"],
//     };

//     it("Debe crear una rutina correctamente si el coach existe", async () => {
//       const mockCoach = { id: 1 };
//       const mockRoutine = { ...mockRoutineData, id: 1 };

//       (Coach.findByPk as jest.Mock).mockResolvedValue(mockCoach);
//       (Routines.create as jest.Mock).mockResolvedValue(mockRoutine);

//       const result = await RoutineService.createRoutine(mockRoutineData);

//       expect(Coach.findByPk).toHaveBeenCalledWith(1);
//       expect(Routines.create).toHaveBeenCalledWith(mockRoutineData);
//       expect(result).toEqual(mockRoutine);
//     });

//     it("Debe lanzar un error si el coach no existe", async () => {
//       (Coach.findByPk as jest.Mock).mockResolvedValue(null);

//       await expect(
//         RoutineService.createRoutine(mockRoutineData)
//       ).rejects.toThrow("Coach no encontrado");

//       expect(Coach.findByPk).toHaveBeenCalledWith(1);
//       expect(Routines.create).not.toHaveBeenCalled();
//     });
//   });

//   describe("getAllRoutines", () => {
//     it("Debe retornar todas las rutinas si existen", async () => {
//       const mockRoutines = [
//         { id: 1, name: "Rutina A" },
//         { id: 2, name: "Rutina B" },
//       ];

//       (Routines.findAll as jest.Mock).mockResolvedValue(mockRoutines);

//       const result = await RoutineService.getAllRoutines();

//       expect(Routines.findAll).toHaveBeenCalled();
//       expect(result).toEqual(mockRoutines);
//     });

//     it("Debe lanzar un error si ocurre un problema al obtener las rutinas", async () => {
//       const errorMessage = "Error en la base de datos";
//       (Routines.findAll as jest.Mock).mockRejectedValue(
//         new Error(errorMessage)
//       );

//       await expect(RoutineService.getAllRoutines()).rejects.toThrow(
//         `Error al obtener las rutinas: ${errorMessage}`
//       );
//     });
//   });

//   describe("assignRoutineToClient", () => {
//     const mockAssignRoutineData: assignRoutineInput = {
//       clientId: 1,
//       routineId: 1,
//       scheduledDate: new Date(),
//     };

//     it("Debe asignar una rutina a un cliente si ambos existen", async () => {
//       (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//       (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//       (ClientRoutines.create as jest.Mock).mockResolvedValue({});

//       await RoutineService.assignRoutineToClient(mockAssignRoutineData);

//       expect(Client.findByPk).toHaveBeenCalledWith(1);
//       expect(Routines.findByPk).toHaveBeenCalledWith(1);
//       expect(ClientRoutines.create).toHaveBeenCalledWith({
//         clientId: 1,
//         routineId: 1,
//         scheduledDate: expect.any(Date),
//       });
//     });

//     it("Debe lanzar un error si el cliente no existe", async () => {
//       (Client.findByPk as jest.Mock).mockResolvedValue(null);

//       await expect(
//         RoutineService.assignRoutineToClient(mockAssignRoutineData)
//       ).rejects.toThrow("El cliente especificado no existe.");

//       expect(Client.findByPk).toHaveBeenCalledWith(1);
//       expect(Routines.findByPk).not.toHaveBeenCalled();
//       expect(ClientRoutines.create).not.toHaveBeenCalled();
//     });

//     it("Debe lanzar un error si la rutina no existe", async () => {
//       (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//       (Routines.findByPk as jest.Mock).mockResolvedValue(null);

//       await expect(
//         RoutineService.assignRoutineToClient(mockAssignRoutineData)
//       ).rejects.toThrow("La rutina especificada no existe.");

//       expect(Client.findByPk).toHaveBeenCalledWith(1);
//       expect(Routines.findByPk).toHaveBeenCalledWith(1);
//       expect(ClientRoutines.create).not.toHaveBeenCalled();
//     });
//   });

//   describe("assignRoutineByEmail", () => {
//     const mockUser = {
//       id: 1,
//       email: "test@example.com",
//       userType: UserType.CLIENT,
//     };
//     const mockClient = { id: 1, coach_id: null, update: jest.fn() };
//     const mockRoutine = { id: 1, name: "Rutina A", coachId: 2 };

//     it("Debe asignar una rutina al cliente usando su correo electrónico", async () => {
//       // Simular respuestas de los modelos
//       (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
//       (Client.findOne as jest.Mock).mockResolvedValue(mockClient);
//       (Routines.findByPk as jest.Mock).mockResolvedValue(mockRoutine);
//       (ClientRoutines.create as jest.Mock).mockResolvedValue({});

//       // Ejecutar el servicio
//       await RoutineService.assignRoutineByEmail(
//         mockUser.email,
//         mockRoutine.id,
//         new Date()
//       );

//       // Verificar llamadas a los métodos simulados
//       expect(Users.findOne).toHaveBeenCalledWith({
//         where: { email: mockUser.email },
//       });
//       expect(Client.findOne).toHaveBeenCalledWith({
//         where: { user_id: mockUser.id },
//       });
//       expect(Routines.findByPk).toHaveBeenCalledWith(mockRoutine.id);
//       expect(ClientRoutines.create).toHaveBeenCalledWith({
//         clientId: mockClient.id,
//         routineId: mockRoutine.id,
//         scheduledDate: expect.any(Date),
//       });

//       // Verificar que el cliente se actualizó con el coachId de la rutina
//       expect(mockClient.update).toHaveBeenCalledWith({
//         coach_id: mockRoutine.coachId,
//       });
//     });

//     it("Debe lanzar un error si el usuario no existe", async () => {
//       (Users.findOne as jest.Mock).mockResolvedValue(null);

//       await expect(
//         RoutineService.assignRoutineByEmail("test@example.com", 1, new Date())
//       ).rejects.toThrow("Usuario no encontrado.");
//     });

//     it("Debe lanzar un error si la rutina no existe", async () => {
//       (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
//       (Client.findOne as jest.Mock).mockResolvedValue(mockClient);
//       (Routines.findByPk as jest.Mock).mockResolvedValue(null);

//       await expect(
//         RoutineService.assignRoutineByEmail(mockUser.email, 999, new Date())
//       ).rejects.toThrow("La rutina especificada no existe.");
//     });
//   });
// });
