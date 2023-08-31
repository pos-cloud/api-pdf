import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";

const mongoDBManager = new MongoDBManager();

export async function getArticleById(id: ObjectId, database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const articleCollection = mongoDBManager.getCollection('articles');
        return await articleCollection.findOne({_id: new ObjectId(id)})
    
    } catch (error) {
        throw Error(error); 
    }
}
