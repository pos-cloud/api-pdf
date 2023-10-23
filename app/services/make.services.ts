import MongoDBManager from "../db/connection";
import Make from "../models/make";

const mongoDBManager = new MongoDBManager();

export async function getmake(id: Object, database: string): Promise<Make[]> {
    try {
        await mongoDBManager.initConnection(database);
        // const objectIdArray = ids.map(id => new ObjectId(id));
        console.log(id)
        const makesCollection = mongoDBManager.getCollection('makes');
        const makes: Make[] = await makesCollection.find({ _id: { $in: [id] } }).toArray()
        return makes;
    } catch (error) {
        console.log(error)
    }
}