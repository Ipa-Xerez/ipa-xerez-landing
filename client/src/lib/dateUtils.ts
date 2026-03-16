/**
 * Formatea una fecha recibida del servidor (UTC) para mostrarla correctamente en el calendario local
 * sin desplazamientos de día por zona horaria.
 */
export function formatLocalDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  
  // Si la fecha es inválida, devolver vacío
  if (isNaN(date.getTime())) return "";

  // Usamos el formato local de España para asegurar consistencia
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Crea un objeto Date a partir de una cadena de fecha del servidor,
 * asegurando que se interprete como mediodía local para evitar saltos de día
 * al convertir entre UTC y local.
 */
export function toSafeLocalDate(dateInput: string | Date): Date {
  const date = new Date(dateInput);
  // Ajustamos a las 12:00 para evitar que el cambio de zona horaria mueva la fecha al día anterior o siguiente
  date.setHours(12, 0, 0, 0);
  return date;
}
