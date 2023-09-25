"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovementsOfArticle = void 0;
const axios_1 = require("axios");
async function getMovementsOfArticle(id, token) {
    try {
        let query = 'where="transaction":"' + id + '"';
        const URL = `${process.env.APIV1}movements-of-articles`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            query: query
        };
        const data = await axios_1.default.get(URL, { headers, params });
        const response = data.data.movementsOfArticles;
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getMovementsOfArticle = getMovementsOfArticle;
//# sourceMappingURL=movements-of-articles.services.js.map