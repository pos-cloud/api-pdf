"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionTypeById = void 0;
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getTransactionTypeById(id, database) {
    try {
        await mongoDBManager.initConnection(database);
        const transactionTypesCollection = mongoDBManager.getCollection('transaction-types');
        const transactionType = await transactionTypesCollection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        return transactionType;
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getTransactionTypeById = getTransactionTypeById;
//# sourceMappingURL=transaction-types.services.js.map