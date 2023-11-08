"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovementsOfCash = void 0;
const axios_1 = require("axios");
async function getMovementsOfCash(token, id) {
    try {
        let query = 'where="transaction":"' + id + '"';
        const URL = `${process.env.APIV1}movements-of-cashes`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            query: query,
        };
        const data = await axios_1.default.get(URL, { headers, params });
        const response = data.data.movementsOfCashes;
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getMovementsOfCash = getMovementsOfCash;
//# sourceMappingURL=movements-of-cash.services.js.map