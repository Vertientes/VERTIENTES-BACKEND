// Función para obtener la fecha actual en formato ISO 8601
export function getCurrentISODate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentISODate = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    return currentISODate;
}
// Función para obtener la fecha actual más un mes en formato ISO 8601
export function getDateNextMonthISO() {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const day = String(nextMonth.getDate()).padStart(2, '0');
    const hours = String(nextMonth.getHours()).padStart(2, '0');
    const minutes = String(nextMonth.getMinutes()).padStart(2, '0');
    const nextMonthISODate = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    return nextMonthISODate;
}

// Función para obtener el inicio del día en el formato ISO 8601
export function getStartTimeOfDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const startOfDay = `${year}-${month}-${day}T00:00:00.000Z`;
    return startOfDay;
}

// Función para obtener el final del día en el formato ISO 8601
export function getEndTimeOfDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const endOfDay = `${year}-${month}-${day}T23:59:59.999Z`;
    return endOfDay;
}

export function getNextBusinessDayISO(dateISO) {
    const currentDate = new Date(dateISO);
    const dayOfWeek = currentDate.getDay();
    const nextDate = new Date(currentDate);
    if (dayOfWeek === 6) { // Sábado
        nextDate.setDate(currentDate.getDate() + 2); // Avanzar al lunes
    } else { // Cualquier otro día de la semana
        nextDate.setDate(currentDate.getDate() + 1); // Avanzar al próximo día
        console.log(nextDate,'tamo bien?')
    }
    return nextDate;
}
