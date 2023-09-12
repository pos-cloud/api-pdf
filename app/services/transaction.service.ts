import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import Transaction from "../models/transaction";

const mongoDBManager = new MongoDBManager();

export async function getTransactionById(id: string, database: string): Promise<Transaction> {
  try {
    await mongoDBManager.initConnection(database);
    const transactionCollection = mongoDBManager.getCollection('transactions');
    const transaction: Transaction = await transactionCollection.findOne({
      _id: new ObjectId(id),
    });
    return transaction;
  } catch (error) {
    throw Error(error);
  }
}