import { format } from "date-fns";
import { calculateRecurrentDates } from "./calculateRoutines.services";

// Función para obtener las fechas recurrentes y formatearlas
export function getRecurrentDatesFromClientData(
  scheduledDate: string,
  recurrenceDay: number,
  time: string | null
): string[] {
  if (!recurrenceDay || !scheduledDate) {
    return [];
  }

  const initialDate = new Date(scheduledDate);
  return calculateRecurrentDates(
    recurrenceDay,
    time || format(initialDate, "HH:mm"),
    initialDate
  ).map((date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));
}
