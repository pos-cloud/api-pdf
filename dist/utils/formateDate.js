"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
function formatDate(dateString) {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
}
exports.formatDate = formatDate;
//# sourceMappingURL=formateDate.js.map