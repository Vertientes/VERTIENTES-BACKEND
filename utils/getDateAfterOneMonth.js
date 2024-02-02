export function getDateAfterOneMonth() {
    const now= new Date();

    // Obtener componentes de la fecha
    const day = now.getDate();
    const month = now.getMonth() + 2; // Nota: Los meses comienzan desde 0
    const year = now.getFullYear();

    // Obtener componentes de la hora
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convertir las horas al formato de 12 horas
    if (hours > 12) {
        hours -= 12;
    }

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    // Formatear la fecha y hora
    const formattedDate = `${day}/${month}/${year} ${formattedHours}:${formattedMinutes}${ampm}`;

    return formattedDate;
}