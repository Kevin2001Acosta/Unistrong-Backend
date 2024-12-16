"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecurrentDatesFromClientData = getRecurrentDatesFromClientData;
const date_fns_1 = require("date-fns");
const calculateRoutines_services_1 = require("./calculateRoutines.services");
// Función para obtener las fechas recurrentes y formatearlas
function getRecurrentDatesFromClientData(scheduledDate, recurrenceDay, time) {
    if (!recurrenceDay || !scheduledDate) {
        return [];
    }
    const initialDate = new Date(scheduledDate);
    return (0, calculateRoutines_services_1.calculateRecurrentDates)(recurrenceDay, time || (0, date_fns_1.format)(initialDate, "HH:mm"), initialDate).map((date) => (0, date_fns_1.format)(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));
}
