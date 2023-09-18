import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";
import MovementOfArticle from "models/movements-of-articles";

const mongoDBManager = new MongoDBManager();

export async function getTransactionTypeById(id: string, database: string): Promise<MovementOfArticle> {
  try {
    await mongoDBManager.initConnection(database);
    const movementOfArticleCollection = mongoDBManager.getCollection('transaction-types');
    const movementOfArticle: MovementOfArticle = await movementOfArticleCollection.findOne({
      _id: new ObjectId(id),
    });
    return movementOfArticle;
  } catch (error) {
    throw Error(error);
  }
}