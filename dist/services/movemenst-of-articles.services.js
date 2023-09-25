"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionTypeById = void 0;
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getTransactionTypeById(id, database) {
    try {
        await mongoDBManager.initConnection(database);
        const movementOfArticleCollection = mongoDBManager.getCollection('transaction-types');
        const movementOfArticle = await movementOfArticleCollection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        return movementOfArticle;
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getTransactionTypeById = getTransactionTypeById;
//# sourceMappingURL=movemenst-of-articles.services.js.map