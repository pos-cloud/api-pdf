"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberDecimal = exports.transform = void 0;
function transform(value, numberOfDecimals = 2) {
    if (value) {
        if (!isNaN(value)) {
            switch (numberOfDecimals) {
                case 0:
                    return Math.round(value * 1) / 1;
                case 1:
                    return Math.round(value * 10) / 10;
                case 2:
                    return Math.round(value * 100) / 100;
                case 3:
                    return Math.round(value * 1000) / 1000;
                case 4:
                    return Math.round(value * 10000) / 10000;
                case 5:
                    return Math.round(value * 100000) / 100000;
                case 6:
                    return Math.round(value * 1000000) / 1000000;
                default:
                    return Math.round(value * 100) / 100;
            }
        }
        else {
            return parseFloat(value.toFixed(numberOfDecimals));
        }
    }
    else {
        if (value === 0) {
            return 0;
        }
        else
            return value;
    }
}
exports.transform = transform;
function numberDecimal(numberDecimal) {
    return numberDecimal.toLocaleString('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    });
}
exports.numberDecimal = numberDecimal;
// export function numberDecimal(numberDecimal: number) {
//     if (typeof numberDecimal === 'number') {
//         return numberDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
//     } else {
//         return 'NaN'; // O manejar otro caso si no es un número válido
//     }
// }
//# sourceMappingURL=format-numbers.js.map