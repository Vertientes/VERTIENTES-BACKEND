export function getActualDate() {
    const now = new Date();

    // Obtener componentes de la fecha
    const day = now.getDate();
    const month = now.getMonth() + 1; // Nota: Los meses comienzan desde 0
    const year = now.getFullYear();

    // Obtener componentes de la hora
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Asegurar que las horas y los minutos tengan dos dígitos
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Formatear la fecha y hora
    const formattedDate = `${day}/${month}/${year} ${formattedHours}:${formattedMinutes}`;

    return formattedDate;
}
