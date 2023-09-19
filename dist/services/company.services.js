"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompany = void 0;
const axios_1 = require("axios");
async function getCompany(token, companyId) {
    try {
        const URL = `${process.env.APIV1}company`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: companyId,
        };
        const data = await axios_1.default.get(URL, { headers, params });
        const response = data.data.company;
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getCompany = getCompany;
//# sourceMappingURL=company.services.js.map