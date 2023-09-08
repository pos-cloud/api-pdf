import MongoDBManager from "../db/connection";
import Config from "../models/config";

const mongoDBManager = new MongoDBManager();

export async function getConfig(database: string) : Promise<Config[]>{
    try {
        await mongoDBManager.initConnection(database);
        const configCollection = mongoDBManager.getCollection('configs');
        const config: Config[]= await configCollection.find().toArray()
        return config;
    } catch (error) {
        throw Error(error); 
    }
}
