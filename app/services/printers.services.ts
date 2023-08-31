import MongoDBManager from "../db/connection";

const mongoDBManager = new MongoDBManager();

export async function getPrinters(database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const usersCollection = mongoDBManager.getCollection('printers');
        return usersCollection.find()
    } catch (error) {
        throw Error(error); 
    }
}
