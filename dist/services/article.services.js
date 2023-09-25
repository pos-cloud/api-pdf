"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleData = void 0;
const axios_1 = require("axios");
async function getArticleData(articleId, token) {
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: articleId,
        };
        const response = await axios_1.default.get(URL, { headers, params });
        return response.data.article;
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getArticleData = getArticleData;
//# sourceMappingURL=article.services.js.map