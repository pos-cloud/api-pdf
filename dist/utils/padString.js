"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padString = void 0;
function padString(n, length) {
    n = n.toString();
    while (n.length < length)
        n = '0' + n;
    return n;
}
exports.padString = padString;
//# sourceMappingURL=padString.js.map