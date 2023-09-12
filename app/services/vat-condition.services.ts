import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import VATCondition from "../models/vat-condition";

const mongoDBManager = new MongoDBManager();

export async function getVatCondition(database: string, id: string): Promise<VATCondition[]> {
    try {
        await mongoDBManager.initConnection(database);

        const vatConditionCollection = mongoDBManager.getCollection('vat-conditions');
        const vatCondition: VATCondition[] = await vatConditionCollection.findOne({
            _id: new ObjectId(id),
          });

        return vatCondition;
    } catch (error) {
        throw Error(error); 
    }
}
