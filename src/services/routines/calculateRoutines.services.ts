import { format } from "date-fns";

// export function calculateRecurrentDates(
//   recurrenceDay: number,
//   time: string,
//   startDate: Date,
//   timezoneOffset: number = 0 // Ajuste para zona horaria
// ): Date[] {
//   const recurrentDates: Date[] = [];
//   let currentDate = new Date(startDate);

//   // Ajustamos la hora inicial según la zona horaria
//   const [hours, minutes] = time.split(":").map(Number);
//   currentDate.setHours(hours - timezoneOffset, minutes, 0, 0);

//   // Encontrar las próximas 4 fechas que coincidan con el `recurrenceDay`
//   while (recurrentDates.length < 4) {
//     currentDate.setDate(currentDate.getDate() + 1);

//     if (currentDate.getDay() === recurrenceDay) {
//       recurrentDates.push(new Date(currentDate));
//     }
//   }

//   return recurrentDates;
// }

export function calculateRecurrentDates(
  recurrenceDay: number,
  time: string,
  startDate: Date,
  timezoneOffset: number = 0 // Ajuste para zona horaria
): string[] {
  // Cambié la firma de retorno a string[]
  const recurrentDates: string[] = [];
  let currentDate = new Date(startDate);

  // Ajustamos la hora inicial según la zona horaria
  const [hours, minutes] = time.split(":").map(Number);
  currentDate.setHours(hours - timezoneOffset, minutes, 0, 0);

  // Encontrar las próximas 4 fechas que coincidan con el `recurrenceDay`
  while (recurrentDates.length < 4) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getDay() === recurrenceDay) {
      // Almacenamos las fechas formateadas como cadenas
      recurrentDates.push(format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")); // Mantén el formato como string
    }
  }

  return recurrentDates;
}
