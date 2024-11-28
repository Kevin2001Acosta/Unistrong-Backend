// import RoutineService from "../../services/routines/routines.services";
// import Routines from "../../db/models/routines.models";
// import CoachService from "../../services/coach/coach.services";
// import Client from "../../db/models/client.models";
// import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
// import ClientRoutines from "../../db/models/client_routines";
// import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";

// jest.mock("../../db/models/routines.models", () => ({
//   create: jest.fn(),
//   findAll: jest.fn(),
//   findByPk: jest.fn(),
// }));

// jest.mock("../../services/coach/coach.services", () => ({
//   getCoachByUser: jest.fn(),
// }));

// jest.mock("../../db/models/client.models", () => ({
//   findByPk: jest.fn(),
// }));

// jest.mock("../../db/models/client_routines", () => ({
//   create: jest.fn(),
// }));

// describe("RoutineService.createRoutine", () => {
//   const mockRoutineData: RoutinesInput = {
//     name: "Rutina de fuerza",
//     coachId: 1, // Esto se refiere al ID del coach en la tabla de Coaches
//     description: "Rutina para aumentar la fuerza",
//     category: "Fuerza",
//     musclesWorked: ["Piernas", "Brazos"],
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("Debe crear una rutina correctamente si el coach existe", async () => {
//     const mockCoach = { id: 1, user_id: 10 }; // Asegúrate de incluir user_id
//     const mockRoutine = { ...mockRoutineData, id: 1 };

//     // Configura el mock para devolver un coach basado en user_id
//     (CoachService.getCoachByUser as jest.Mock).mockResolvedValue(mockCoach);

//     // Mock para la creación de la rutina
//     (Routines.create as jest.Mock).mockResolvedValue(mockRoutine);

//     // Llama al servicio
//     const result = await RoutineService.createRoutine({
//       ...mockRoutineData,
//       coachId: mockCoach.user_id, // Pasamos el user_id esperado
//     });

//     // Verifica que el servicio fue llamado correctamente
//     expect(CoachService.getCoachByUser).toHaveBeenCalledWith(mockCoach.user_id);
//     expect(Routines.create).toHaveBeenCalledWith({
//       ...mockRoutineData,
//       coachId: 1, // Este es el id del coach en la rutina
//     });
//     expect(result).toEqual(mockRoutine);
//   });

//   it("Debe lanzar un error si el coach no existe", async () => {
//     // Configura el mock para devolver null
//     (CoachService.getCoachByUser as jest.Mock).mockResolvedValue(null);

//     // Espera un error al intentar crear la rutina
//     await expect(RoutineService.createRoutine(mockRoutineData)).rejects.toThrow(
//       "Coach no encontrado"
//     );

//     // Verifica que no se haya creado la rutina
//     expect(CoachService.getCoachByUser).toHaveBeenCalledWith(
//       mockRoutineData.coachId
//     );
//     expect(Routines.create).not.toHaveBeenCalled();
//   });
// });

// describe("RoutineService.getAllRoutines", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("Debe retornar todas las rutinas con clientes asignados", async () => {
//     const mockRoutines = [
//       { id: 1, name: "Rutina A", clients: [{ id: 1, name: "Cliente A" }] },
//       { id: 2, name: "Rutina B", clients: [{ id: 2, name: "Cliente B" }] },
//     ];

//     (Routines.findAll as jest.Mock).mockResolvedValue(mockRoutines);

//     const result = await RoutineService.getAllRoutines();

//     expect(Routines.findAll).toHaveBeenCalledWith({
//       include: [{ model: Client, as: "clients" }],
//     });
//     expect(result).toEqual(mockRoutines);
//   });

//   it("Debe lanzar un error si ocurre un problema al obtener las rutinas", async () => {
//     const errorMessage = "Error en la base de datos";
//     (Routines.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

//     await expect(RoutineService.getAllRoutines()).rejects.toThrow(
//       `Error al obtener las rutinas: ${errorMessage}`
//     );
//   });
// });

// describe("RoutineService.assignRoutineToClient", () => {
//   const mockAssignRoutineData: assignRoutineInput = {
//     clientId: 1,
//     routineId: 1,
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("Debe asignar una rutina a un cliente si ambos existen", async () => {
//     (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//     (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//     (ClientRoutines.create as jest.Mock).mockResolvedValue({
//       clientId: 1,
//       routineId: 1,
//     });

//     await RoutineService.assignRoutineToClient(mockAssignRoutineData);

//     expect(Client.findByPk).toHaveBeenCalledWith(1);
//     expect(Routines.findByPk).toHaveBeenCalledWith(1);
//     expect(ClientRoutines.create).toHaveBeenCalledWith(mockAssignRoutineData);
//   });

//   it("Debe lanzar un error si el cliente no existe", async () => {
//     (Client.findByPk as jest.Mock).mockResolvedValue(null);

//     await expect(
//       RoutineService.assignRoutineToClient(mockAssignRoutineData)
//     ).rejects.toThrow("El cliente especificado no existe.");
//     expect(Client.findByPk).toHaveBeenCalledWith(1);
//     expect(Routines.findByPk).not.toHaveBeenCalled();
//     expect(ClientRoutines.create).not.toHaveBeenCalled();
//   });

//   it("Debe lanzar un error si la rutina no existe", async () => {
//     (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//     (Routines.findByPk as jest.Mock).mockResolvedValue(null);

//     await expect(
//       RoutineService.assignRoutineToClient(mockAssignRoutineData)
//     ).rejects.toThrow("La rutina especificada no existe.");
//     expect(Client.findByPk).toHaveBeenCalledWith(1);
//     expect(Routines.findByPk).toHaveBeenCalledWith(1);
//     expect(ClientRoutines.create).not.toHaveBeenCalled();
//   });

//   it("Debe lanzar un error si ocurre un problema al asignar la rutina", async () => {
//     const errorMessage = "Error en la base de datos";
//     (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//     (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
//     (ClientRoutines.create as jest.Mock).mockRejectedValue(
//       new Error(errorMessage)
//     );

//     await expect(
//       RoutineService.assignRoutineToClient(mockAssignRoutineData)
//     ).rejects.toThrow(`Error al asignar la rutina: ${errorMessage}`);
//   });
// });

import RoutineService from "../../services/routines/routines.services";
import Routines from "../../db/models/routines.models";
import Client from "../../db/models/client.models";
import ClientRoutines from "../../db/models/client_routines";
import Coach from "../../db/models/coach.models";
import Users from "../../db/models/user.model";
import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";
import { UserType } from "../../db/models/utils/user.types";

jest.mock("../../db/models/routines.models", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../db/models/client.models", () => ({
  findByPk: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../db/models/client_routines", () => ({
  create: jest.fn(),
}));

jest.mock("../../db/models/coach.models", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../db/models/user.model", () => ({
  findOne: jest.fn(),
}));

describe("RoutineService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRoutine", () => {
    const mockRoutineData: RoutinesInput = {
      name: "Rutina de fuerza",
      coachId: 1,
      description: "Rutina para aumentar la fuerza",
      category: "Fuerza",
      musclesWorked: ["Piernas", "Brazos"],
    };

    it("Debe crear una rutina correctamente si el coach existe", async () => {
      const mockCoach = { id: 1 };
      const mockRoutine = { ...mockRoutineData, id: 1 };

      (Coach.findByPk as jest.Mock).mockResolvedValue(mockCoach);
      (Routines.create as jest.Mock).mockResolvedValue(mockRoutine);

      const result = await RoutineService.createRoutine(mockRoutineData);

      expect(Coach.findByPk).toHaveBeenCalledWith(1);
      expect(Routines.create).toHaveBeenCalledWith(mockRoutineData);
      expect(result).toEqual(mockRoutine);
    });

    it("Debe lanzar un error si el coach no existe", async () => {
      (Coach.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        RoutineService.createRoutine(mockRoutineData)
      ).rejects.toThrow("Coach no encontrado");

      expect(Coach.findByPk).toHaveBeenCalledWith(1);
      expect(Routines.create).not.toHaveBeenCalled();
    });
  });

  describe("getAllRoutines", () => {
    it("Debe retornar todas las rutinas si existen", async () => {
      const mockRoutines = [
        { id: 1, name: "Rutina A" },
        { id: 2, name: "Rutina B" },
      ];

      (Routines.findAll as jest.Mock).mockResolvedValue(mockRoutines);

      const result = await RoutineService.getAllRoutines();

      expect(Routines.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRoutines);
    });

    it("Debe lanzar un error si ocurre un problema al obtener las rutinas", async () => {
      const errorMessage = "Error en la base de datos";
      (Routines.findAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(RoutineService.getAllRoutines()).rejects.toThrow(
        `Error al obtener las rutinas: ${errorMessage}`
      );
    });
  });

  describe("assignRoutineToClient", () => {
    const mockAssignRoutineData: assignRoutineInput = {
      clientId: 1,
      routineId: 1,
      scheduledDate: new Date(),
    };

    it("Debe asignar una rutina a un cliente si ambos existen", async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (ClientRoutines.create as jest.Mock).mockResolvedValue({});

      await RoutineService.assignRoutineToClient(mockAssignRoutineData);

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Routines.findByPk).toHaveBeenCalledWith(1);
      expect(ClientRoutines.create).toHaveBeenCalledWith({
        clientId: 1,
        routineId: 1,
        scheduledDate: expect.any(Date),
      });
    });

    it("Debe lanzar un error si el cliente no existe", async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        RoutineService.assignRoutineToClient(mockAssignRoutineData)
      ).rejects.toThrow("El cliente especificado no existe.");

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Routines.findByPk).not.toHaveBeenCalled();
      expect(ClientRoutines.create).not.toHaveBeenCalled();
    });

    it("Debe lanzar un error si la rutina no existe", async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Routines.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        RoutineService.assignRoutineToClient(mockAssignRoutineData)
      ).rejects.toThrow("La rutina especificada no existe.");

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Routines.findByPk).toHaveBeenCalledWith(1);
      expect(ClientRoutines.create).not.toHaveBeenCalled();
    });
  });

  describe("assignRoutineByEmail", () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      userType: UserType.CLIENT,
    };
    const mockClient = { id: 1 };
    const mockRoutine = { id: 1, name: "Rutina A" };

    it("Debe asignar una rutina al cliente usando su correo electrónico", async () => {
      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Client.findOne as jest.Mock).mockResolvedValue(mockClient);
      (Routines.findOne as jest.Mock).mockResolvedValue(mockRoutine);
      (ClientRoutines.create as jest.Mock).mockResolvedValue({});

      await RoutineService.assignRoutineByEmail(
        mockUser.email,
        mockRoutine.name,
        new Date()
      );

      expect(Users.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(Client.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.id },
      });
      expect(Routines.findOne).toHaveBeenCalledWith({
        where: { name: mockRoutine.name },
      });
      expect(ClientRoutines.create).toHaveBeenCalledWith({
        clientId: mockClient.id,
        routineId: mockRoutine.id,
        scheduledDate: expect.any(Date),
      });
    });

    it("Debe lanzar un error si el usuario no existe", async () => {
      (Users.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        RoutineService.assignRoutineByEmail(
          "test@example.com",
          "Rutina A",
          new Date()
        )
      ).rejects.toThrow("Usuario no encontrado.");
    });
  });
});
