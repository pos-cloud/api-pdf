import article from "../models/article";
import { ObjectId } from "mongodb";

export async function getArticle(id: ObjectId){
    try {
       return await article.findOne({_id: id})
      
    } catch (error) {
        throw Error(error); 
    }
}
