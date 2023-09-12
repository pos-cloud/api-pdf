import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import Company from "../models/company";

const mongoDBManager = new MongoDBManager();

export async function getCompany(database: string, id: string): Promise<Company> {
    try {
        await mongoDBManager.initConnection(database);

        const companyCollection = mongoDBManager.getCollection('companies');
        const company: Company = await companyCollection.findOne({
            _id: new ObjectId(id),
          });
        return company;
    } catch (error) {
        throw Error(error); 
    }
}
