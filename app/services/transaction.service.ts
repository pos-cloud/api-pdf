import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import Transaction from "../models/transaction";

const mongoDBManager = new MongoDBManager();

export async function getTransactionById(id: string, database: string): Promise<Transaction>{
    // try {
    //     await mongoDBManager.initConnection(database);
    //     const transactionCollection = mongoDBManager.getCollection('transactions');
    //     const transaction: Transaction = await transactionCollection.findOne({
    //         _id: new ObjectId(id),
    //     });
    //     return transaction;
    // } catch (error) {
    //     throw Error(error); 
    // }
    try {
        await mongoDBManager.initConnection(database);    
        const transactionCollection = mongoDBManager.getCollection('transactions');
        const aggregationPipeline = [
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'company',
              foreignField: '_id',
              as: 'company',
            },
          },
          {
            $unwind: '$company',
          },
          {
            $lookup: {
              from: 'vat-conditions',
              localField: 'company.vatCondition', 
              foreignField: '_id',
              as: 'company.vatCondition', 
            },
        },
        {
            $set: {
              'company.vatCondition': { $arrayElemAt: ['$company.vatCondition', 0] },
            },
          },
        ];
    
        const transactionResultArray = await transactionCollection.aggregate(aggregationPipeline).toArray();
        
        const transactionResult: Transaction = transactionResultArray[0] as Transaction;
        console.log(transactionResult)
         return transactionResult;
      } catch (error) {
        throw Error(error);
      }
}