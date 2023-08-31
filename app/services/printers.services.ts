import MongoDBManager from "../db/connection";
import { ObjectId } from "mongodb";

const mongoDBManager = new MongoDBManager();

export async function getPrinters(database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const printersCollection = mongoDBManager.getCollection('printers');
        return await printersCollection.find({}).toArray();
        // return await usersCollection.findOne({_id: new ObjectId(id)})
    } catch (error) {
        throw Error(error); 
    }
}
