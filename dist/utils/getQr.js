"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQRCode = void 0;
const qrcode = require('qrcode');
async function getQRCode(url) {
    try {
        const qrCode = await qrcode.toDataURL(url);
        return qrCode;
    }
    catch (error) {
        console.error('Error generando el código QR:', error);
        throw error;
    }
}
exports.getQRCode = getQRCode;
//# sourceMappingURL=getQr.js.map