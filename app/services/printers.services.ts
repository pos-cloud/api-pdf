import MongoDBManager from "../db/connection";
import { ObjectId } from "mongodb";

const mongoDBManager = new MongoDBManager();

export async function getPrinters(database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const printersCollection = mongoDBManager.getCollection('printers');
       // return await printersCollection.find({}).toArray();
        return await printersCollection.findOne({_id: new ObjectId('64f627dd2d0abf003a651afe')})
    } catch (error) {
        throw Error(error); 
    }
}
