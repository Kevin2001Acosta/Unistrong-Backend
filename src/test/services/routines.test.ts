import RoutineService from "../../services/routines/routines.services";
import Routines from "../../db/models/routines.models";
import CoachService from "../../services/coach/coach.services";
import Client from "../../db/models/client.models";
import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
import ClientRoutines from "../../db/models/client_routines";
import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";

jest.mock("../../db/models/routines.models", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../../services/coach/coach.services", () => ({
  getCoachByUser: jest.fn(),
}));

jest.mock("../../db/models/client.models", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../db/models/client_routines", () => ({
  create: jest.fn(),
}));

describe("RoutineService.createRoutine", () => {
  const mockRoutineData: RoutinesInput = {
    name: "Rutina de fuerza",
    coachId: 1,
    description: "Rutina para aumentar la fuerza",
    category: "Fuerza",
    musclesWorked: ["Piernas", "Brazos"],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe crear una rutina correctamente si el coach existe", async () => {
    const mockCoach = { id: 1 };
    const mockRoutine = { ...mockRoutineData, id: 1 };

    (CoachService.getCoachByUser as jest.Mock).mockResolvedValue(mockCoach);
    (Routines.create as jest.Mock).mockResolvedValue(mockRoutine);

    const result = await RoutineService.createRoutine(mockRoutineData);

    expect(CoachService.getCoachByUser).toHaveBeenCalledWith(1);
    expect(Routines.create).toHaveBeenCalledWith({
      ...mockRoutineData,
      coachId: 1,
    });
    expect(result).toEqual(mockRoutine);
  });

  it("Debe lanzar un error si el coach no existe", async () => {
    (CoachService.getCoachByUser as jest.Mock).mockResolvedValue(null);

    await expect(RoutineService.createRoutine(mockRoutineData)).rejects.toThrow(
      "Coach no encontrado"
    );
    expect(CoachService.getCoachByUser).toHaveBeenCalledWith(1);
    expect(Routines.create).not.toHaveBeenCalled();
  });
});

describe("RoutineService.getAllRoutines", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe retornar todas las rutinas con clientes asignados", async () => {
    const mockRoutines = [
      { id: 1, name: "Rutina A", clients: [{ id: 1, name: "Cliente A" }] },
      { id: 2, name: "Rutina B", clients: [{ id: 2, name: "Cliente B" }] },
    ];

    (Routines.findAll as jest.Mock).mockResolvedValue(mockRoutines);

    const result = await RoutineService.getAllRoutines();

    expect(Routines.findAll).toHaveBeenCalledWith({
      include: [{ model: Client, as: "clients" }],
    });
    expect(result).toEqual(mockRoutines);
  });

  it("Debe lanzar un error si ocurre un problema al obtener las rutinas", async () => {
    const errorMessage = "Error en la base de datos";
    (Routines.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(RoutineService.getAllRoutines()).rejects.toThrow(
      `Error al obtener las rutinas: ${errorMessage}`
    );
  });
});

describe("RoutineService.assignRoutineToClient", () => {
  const mockAssignRoutineData: assignRoutineInput = {
    clientId: 1,
    routineId: 1,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe asignar una rutina a un cliente si ambos existen", async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    (ClientRoutines.create as jest.Mock).mockResolvedValue({
      clientId: 1,
      routineId: 1,
    });

    await RoutineService.assignRoutineToClient(mockAssignRoutineData);

    expect(Client.findByPk).toHaveBeenCalledWith(1);
    expect(Routines.findByPk).toHaveBeenCalledWith(1);
    expect(ClientRoutines.create).toHaveBeenCalledWith(mockAssignRoutineData);
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

  it("Debe lanzar un error si ocurre un problema al asignar la rutina", async () => {
    const errorMessage = "Error en la base de datos";
    (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    (Routines.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    (ClientRoutines.create as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await expect(
      RoutineService.assignRoutineToClient(mockAssignRoutineData)
    ).rejects.toThrow(`Error al asignar la rutina: ${errorMessage}`);
  });
});
