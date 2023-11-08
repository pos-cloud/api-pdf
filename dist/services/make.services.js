"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getmake = void 0;
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getmake(id, database) {
    try {
        await mongoDBManager.initConnection(database);
        const makesCollection = mongoDBManager.getCollection('makes');
        const makes = await makesCollection.findOne({ _id: id });
        return makes;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getmake = getmake;
//# sourceMappingURL=make.services.js.map