export interface ClientInput {
  userId: number;
  coachId: number;
  nutritionistId: number;
  birthDate: Date;
  height: number;
  diseases?: string[];
  dietaryRestrictions?: string[];
}
