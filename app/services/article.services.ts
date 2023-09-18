// import { ObjectId } from "mongodb";
// import MongoDBManager from "../db/connection";
// import ArticleI from "models/article";

// const mongoDBManager = new MongoDBManager();

// export async function getArticleById(id: string, database: string) : Promise<ArticleI>{
//     try {
//         await mongoDBManager.initConnection(database);
//         const articlesCollection = mongoDBManager.getCollection('articles');
//         const article: ArticleI = await articlesCollection.findOne({
//             _id: new ObjectId(id),
//         });
//         return article;
//     } catch (error) {
//         throw Error(error); 
//     }
// }
import axios from "axios";

export async function getArticleData(articleId: string, token: string) {
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: articleId,
        };

        const response = await axios.get(URL, { headers, params})
    
        return response.data.article
    } catch (error) {
        throw Error(error);
    }

}
