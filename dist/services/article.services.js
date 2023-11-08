"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticlesData = exports.getArticleData = void 0;
const axios_1 = require("axios");
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getArticleData(articleId, token) {
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: articleId
        };
        const data = await axios_1.default.get(URL, { headers, params });
        const responses = data.data.article;
        return responses;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getArticleData = getArticleData;
async function getArticlesData(ids, database) {
    try {
        await mongoDBManager.initConnection(database);
        const objectIdArray = ids.map(id => new mongodb_1.ObjectId(id));
        const articlesCollection = mongoDBManager.getCollection('articles');
        const articles = await articlesCollection.find({ _id: { $in: objectIdArray } }).toArray();
        return articles;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getArticlesData = getArticlesData;
//# sourceMappingURL=article.services.js.map