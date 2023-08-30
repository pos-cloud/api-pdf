import { Request, Response } from 'express';
import { getArticle } from "../services/articleServices";
import { ObjectId } from 'mongodb';

export async function getArticleController(request: Request, res: Response) {
    try {
   
        const { id_article } = request.body;
       
        const articls = await getArticle(id_article);
        if (!articls) {
            return res.status(404).json({ message: 'Article no encontrado' });
        }
        res.status(200).json({ 'article': articls });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}