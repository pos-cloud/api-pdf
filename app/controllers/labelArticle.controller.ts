import { Request, Response } from 'express';
import { getArticleById } from "../services/article.services";
import MongoDBManager from '../db/connection';



export async function getArticleController(request: any, res: Response) {
    try {
        const { id_article } = request.body;
        const database = (request['database'] || '')
        const article = await getArticleById(id_article, database);
        if (!article) {
            return res.status(404).json({ message: 'Article no encontrado' });
        }
        res.status(200).json({ 'article': article });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}