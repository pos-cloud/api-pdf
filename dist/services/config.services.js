"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const axios_1 = require("axios");
async function getConfig(token) {
    try {
        const URL = `${process.env.APIV1}config`;
        const headers = {
            'Authorization': token,
        };
        const data = await axios_1.default.get(URL, { headers });
        const response = data.data.configs;
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getConfig = getConfig;
//# sourceMappingURL=config.services.js.map