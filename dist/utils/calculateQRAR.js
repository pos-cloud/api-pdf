"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateQRAR = void 0;
const getBarcode_1 = require("./getBarcode");
async function calculateQRAR(transaction, config) {
    var _a;
    let url = 'https://www.afip.gob.ar/fe/qr/?p=';
    let datos = {};
    let codeInvoice;
    if (transaction.type.codes && transaction.type.codes.length > 0) {
        for (let y = 0; y < transaction.type.codes.length; y++) {
            if (transaction.letter == transaction.type.codes[y].letter) {
                codeInvoice = transaction.type.codes[y].code;
            }
        }
    }
    datos['ver'] = 1;
    datos['fecha'] = (_a = transaction.CAEExpirationDate) !== null && _a !== void 0 ? _a : transaction['endDate'];
    datos['cuit'] = config.companyIdentificationValue.replace('-', '');
    datos['ptoVta'] = transaction.origin;
    datos['tipoCmp'] = codeInvoice;
    datos['nroCmp'] = transaction.number;
    datos['importe'] = transaction.totalPrice;
    datos['moneda'] = 'PES';
    datos['ctz'] = 1;
    datos['tipoCodAut'] = 'E';
    datos['tipoDocRec'] = 80;
    datos['nroDocRec'] = config.companyIdentificationValue.replace('-', '');
    datos['codAut'] = transaction.CAE;
    let objJsonB64 = btoa(JSON.stringify(datos));
    url += objJsonB64;
    //  const response = await getQRCode(url)
    const response = (0, getBarcode_1.getBarcode)('qr', url);
    return response;
}
exports.calculateQRAR = calculateQRAR;
//# sourceMappingURL=calculateQRAR.js.map