import axios from "axios";
import Article from "../models/article";
import { ObjectId } from "mongodb";
import MongoDBManager from "../db/connection";

const mongoDBManager = new MongoDBManager();

export async function getArticleData(articleId: string, token: string): Promise<Article> {
  try {
    const URL = `${process.env.APIV1}article`;
    const headers = {
      'Authorization': token,
    };

    const params = {
      id: articleId
    }
    const data = await axios.get(URL, { headers, params });
    const responses: Article = data.data.article
  
    return responses;
  } catch (error) {
    console.log(error)
  }
}

export async function getArticlesData(ids: string[], database: string): Promise<Article[]> {
  try {
    await mongoDBManager.ensureConnection(database);

    const objectIdArray = ids.map(id => new ObjectId(id));
    const articlesCollection = mongoDBManager.getCollection('articles'); 
    const articles = await articlesCollection.find({ _id: { $in: objectIdArray } }).toArray();

    return articles;
  } catch (error) {
    console.error('Error en getArticlesData:', error);
    throw error;
  }
}