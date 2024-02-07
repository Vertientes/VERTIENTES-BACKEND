export function getActualDate() {
    const now = new Date();

    // Obtener componentes de la fecha
    const day = now.getDate();
    const month = now.getMonth() + 1; // Nota: Los meses comienzan desde 0
    const year = now.getFullYear();

    // Obtener componentes de la hora
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    

    // Asegurar que las horas y los minutos tengan dos dígitos
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Formatear la fecha y hora
    const formattedDate = `${day}/${month}/${year} ${formattedHours}:${formattedMinutes}${ampm}`;

    return formattedDate;
}


// Función para obtener el inicio del día en el formato ISO 8601
export function getStartTimeOfDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const startOfDay = `${year}-${month}-${day}T00:00:00.000Z`;
    return startOfDay;
}

// Función para obtener el final del día en el formato ISO 8601
export function getEndTimeOfDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const endOfDay = `${year}-${month}-${day}T23:59:59.999Z`;
    return endOfDay;
}




// Función para obtener la fecha actual en formato ISO 8601
export function getCurrentISODate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que tenga 3 dígitos
    const currentISODate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return currentISODate;
}

// Función para obtener la fecha actual más un día en formato ISO 8601
export function getDateTomorrowISO() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const day = String(tomorrow.getDate()).padStart(2, '0'); // Asegurar que tenga 2 dígitos

    const tomorrowISODate = `${year}-${month}-${day}T00:00:00.000Z`;
    return tomorrowISODate;
}

// Función para obtener la fecha actual más un mes en formato ISO 8601
export function getDateNextMonthISO() {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const day = String(nextMonth.getDate()).padStart(2, '0'); // Asegurar que tenga 2 dígitos

    const nextMonthISODate = `${year}-${month}-${day}T00:00:00.000Z`;
    return nextMonthISODate;
}

