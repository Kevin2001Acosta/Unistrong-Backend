export interface ClientInput {
  userId: number;
  coachId: number;
  nutritionistId: number;
  birthYear: number;
  height: number;
  diseases?: string[];
  dietaryRestrictions?: string[];
}
