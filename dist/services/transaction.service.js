"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = void 0;
const axios_1 = require("axios");
async function getTransactionById(id, token) {
    try {
        const URL = `${process.env.APIV1}transaction`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: id,
        };
        const data = await axios_1.default.get(URL, { headers, params });
        const response = data.data.transaction;
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getTransactionById = getTransactionById;
//# sourceMappingURL=transaction.service.js.map