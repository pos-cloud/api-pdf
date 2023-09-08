export function formatDate(date: any) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
}
  
  
  
  