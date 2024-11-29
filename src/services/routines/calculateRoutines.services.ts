export function calculateRecurrentDates(
  recurrenceDay: number,
  time: string,
  startDate: Date | null
) {
  const recurrentDates: Date[] = [];
  const currentDate = startDate ? new Date(startDate) : new Date(); // Si startDate es null, se calcula con  la fecha actual

  // se establece la hora de la fecha inicial
  const [hours, minutes] = time.split(":").map(Number);
  currentDate.setHours(hours, minutes, 0, 0);

  // calcula la próxima fecha que coincida con el recurrenceDay
  while (recurrentDates.length < 5) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getDay() === recurrenceDay) {
      recurrentDates.push(new Date(currentDate)); // Añadimos la fecha recurrente
    }
  }

  return recurrentDates;
}
