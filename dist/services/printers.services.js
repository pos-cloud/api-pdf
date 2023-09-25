"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrinters = void 0;
const axios_1 = require("axios");
async function getPrinters(token, query) {
    try {
        const URL = `${process.env.APIV1}printers`;
        const headers = {
            'Authorization': token,
        };
        const data = await axios_1.default.get(URL, { headers });
        const response = data.data.printers;
        const foundPrinter = response.find(printer => printer.printIn === query);
        return foundPrinter;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getPrinters = getPrinters;
//# sourceMappingURL=printers.services.js.map