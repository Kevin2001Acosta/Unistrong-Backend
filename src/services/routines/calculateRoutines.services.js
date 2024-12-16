"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRecurrentDates = calculateRecurrentDates;
const date_fns_1 = require("date-fns");
function calculateRecurrentDates(recurrenceDay, time, startDate, timezoneOffset = 0 // Ajuste para zona horaria
) {
    // Cambié la firma de retorno a string[]
    const recurrentDates = [];
    let currentDate = new Date(startDate);
    // Ajustamos la hora inicial según la zona horaria
    const [hours, minutes] = time.split(":").map(Number);
    currentDate.setHours(hours - timezoneOffset, minutes, 0, 0);
    // Encontrar las próximas 4 fechas que coincidan con el `recurrenceDay`
    while (recurrentDates.length < 4) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() === recurrenceDay) {
            // Almacenamos las fechas formateadas como cadenas
            recurrentDates.push((0, date_fns_1.format)(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")); // Mantén el formato como string
        }
    }
    return recurrentDates;
}
