import { Request, Response } from 'express';
import { getArticleById } from "../services/article.services";
import request from '../interfaces/request.interface'
import { getPrinters } from '../services/printers.services';
import { buildPrint } from '../middleware/buildPrint.middleware';

export async function getArticleLabelController(request: request, res: Response) {
        const { id_article } = request.body;
    try {
        const database = (request['database'] || '')
        const article = await getArticleById(id_article, database);
        if (!article) {
            return res.status(404).json({ message: 'Article no encontrado' });
        }
        const printers = await getPrinters(database)
        const printer = printers.find(printerAux => printerAux.printIn === 'Etiqueta');

        if (printer) {
            const response = buildPrint(printer, article)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');
            res.send(response)
        } else {
            return res.status(404).send('No se encontró la impresora, debe crear una impresora de tipo etiqueta');
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}