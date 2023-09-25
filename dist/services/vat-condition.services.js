"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVatCondition = void 0;
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getVatCondition(database, id) {
    try {
        await mongoDBManager.initConnection(database);
        const vatConditionCollection = mongoDBManager.getCollection('vat-conditions');
        const vatCondition = await vatConditionCollection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        return vatCondition;
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getVatCondition = getVatCondition;
//# sourceMappingURL=vat-condition.services.js.map