// src/test/services/verification.test.ts
import VerificationService from "../../services/verification/verification.services";
import Verification from "../../db/models/verification.models";
import userServices from "../../services/user/user.services";
import { VerificationType } from "../../db/models/utils/verification.type";

jest.mock("../../db/models/verification.models");
jest.mock("../../services/user/user.services");

describe("VerificationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createVerificationCode", () => {
    it("debería crear un código de verificación nuevo y actualizar los anteriores a verificados", async () => {
      const userId = BigInt(1);
      const code = "123456";
      const type = VerificationType.Password;

      (Verification.update as jest.Mock).mockResolvedValue([1]);
      (Verification.create as jest.Mock).mockResolvedValue(true);

      await VerificationService.createVerificationCode(userId, code, type);

      expect(Verification.update).toHaveBeenCalledWith(
        { verified: true },
        { where: { userId, active: true, verified: false } }
      );
      expect(Verification.create).toHaveBeenCalledWith({
        userId,
        code,
        expiration_date: expect.any(Date),
        type,
      });
    });
  });

  describe("verifyCodeoOfPassword", () => {
    it("debería lanzar error si el email no está registrado", async () => {
      const email = "nonexistent@example.com";
      (userServices.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        VerificationService.verifyCodeoOfPassword(email, "123456")
      ).rejects.toThrow("El email no está registrado");
    });

    it("debería lanzar error si el código de verificación es inválido", async () => {
      const email = "test@example.com";
      const code = "invalid";
      (userServices.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        VerificationService.verifyCodeoOfPassword(email, code)
      ).rejects.toThrow("Código de verificación inválido");
    });

    it("debería lanzar error si el código de verificación está expirado", async () => {
      const email = "test@example.com";
      const code = "expired";
      const expiredVerification = {
        expiration_date: new Date(Date.now() - 1000), // Fecha expirado
        verified: false, // Aseguramos la propiedad 'verified'
      };
      (userServices.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(
        expiredVerification
      );

      await expect(
        VerificationService.verifyCodeoOfPassword(email, code)
      ).rejects.toThrow("Código de verificación expirado");
    });

    it("debería verificar el código correctamente si es válido", async () => {
      const email = "test@example.com";
      const code = "123456";
      const validVerification = {
        expiration_date: new Date(Date.now() + 1000), // Fecha válida
        save: jest.fn(),
        verified: false, // Aseguramos la propiedad 'verified'
      };
      (userServices.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(validVerification);

      const result = await VerificationService.verifyCodeoOfPassword(
        email,
        code
      );

      expect(result).toBe(true);
      expect(validVerification.save).toHaveBeenCalled();
      expect(validVerification.verified).toBe(true);
    });
  });

  describe("verifyCodeoOfEmail", () => {
    it("debería lanzar error si el usuario no está registrado", async () => {
      const userId = 999;
      (userServices.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        VerificationService.verifyCodeoOfEmail(userId, "123456")
      ).rejects.toThrow("El usuario no está registrado");
    });

    it("debería lanzar error si el código de verificación es inválido", async () => {
      const userId = 1;
      const code = "invalid";
      (userServices.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        VerificationService.verifyCodeoOfEmail(userId, code)
      ).rejects.toThrow("Código de verificación inválido");
    });

    it("debería lanzar error si el código de verificación está expirado", async () => {
      const userId = 1;
      const code = "expired";
      const expiredVerification = {
        expiration_date: new Date(Date.now() - 1000), // Fecha expirado
        verified: false, // Aseguramos la propiedad 'verified'
      };
      (userServices.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(
        expiredVerification
      );

      await expect(
        VerificationService.verifyCodeoOfEmail(userId, code)
      ).rejects.toThrow("Código de verificación expirado");
    });

    it("debería verificar el código correctamente si es válido", async () => {
      const userId = 1;
      const code = "123456";
      const validVerification = {
        expiration_date: new Date(Date.now() + 1000), // Fecha válida
        save: jest.fn(),
        verified: false, // Aseguramos la propiedad 'verified'
      };
      (userServices.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (Verification.findOne as jest.Mock).mockResolvedValue(validVerification);

      const result = await VerificationService.verifyCodeoOfEmail(userId, code);

      expect(result).toBe(true);
      expect(validVerification.save).toHaveBeenCalled();
      expect(validVerification.verified).toBe(true);
    });
  });
});
