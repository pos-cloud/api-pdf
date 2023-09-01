import MongoDBManager from "../db/connection";

const mongoDBManager = new MongoDBManager();

export async function getMovementsOfArticle(database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const printersCollection = mongoDBManager.getCollection('movements-of-articles');
        return await printersCollection.find({}).toArray();
    } catch (error) {
        throw Error(error); 
    }
}

export async function getMovementsOfCash(database: any){
    try {
        await mongoDBManager.initConnection(database || '');
        const printersCollection = mongoDBManager.getCollection('movements-of-cashes');
        return await printersCollection.find({}).toArray();
    } catch (error) {
        throw Error(error); 
    }
}