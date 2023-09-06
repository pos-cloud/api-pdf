import Printer from "models/printer";
import MongoDBManager from "../db/connection";

const mongoDBManager = new MongoDBManager();

export async function getPrinters(database: string, query: string): Promise<Printer[]> {
    try {
        await mongoDBManager.initConnection(database);

        const printersCollection = mongoDBManager.getCollection('printers');
        const printers: Printer[] = await printersCollection.find({ printIn : query }).toArray()

        return printers;
    } catch (error) {
        throw Error(error); 
    }
}
