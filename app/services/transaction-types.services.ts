import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import { TransactionType } from "../models/transaction-types";

const mongoDBManager = new MongoDBManager();

export async function getTransactionTypeById(id: string, database: string): Promise<TransactionType> {
  try {
    await mongoDBManager.initConnection(database);
    const transactionTypesCollection = mongoDBManager.getCollection('transaction-types');
    const transactionType: TransactionType = await transactionTypesCollection.findOne({
      _id: new ObjectId(id),
    });
    return transactionType;
  } catch (error) {
    throw Error(error);
  }
}