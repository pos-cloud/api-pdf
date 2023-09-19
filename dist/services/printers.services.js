"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrinters = void 0;
const connection_1 = require("../db/connection");
const mongoDBManager = new connection_1.default();
async function getPrinters(database, query) {
    try {
        await mongoDBManager.initConnection(database);
        const printersCollection = mongoDBManager.getCollection('printers');
        const printers = await printersCollection.find({ printIn: query }).toArray();
        return printers;
    }
    catch (error) {
        throw Error(error);
    }
}
exports.getPrinters = getPrinters;
//# sourceMappingURL=printers.services.js.map