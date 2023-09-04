import { Request, Response } from 'express';
import request from '../interfaces/request.interface'
import { getArticleById } from "../services/article.services";
import { getPrinters } from '../services/printers.services';
import { buildPrint } from '../middleware/buildPrint.middleware';
import { getMovementsOfArticle, getMovementsOfCash } from '../services/movements.service';


export async function getArticleLabelController(request: request, res: Response) {
    const { id_article } = request.body;
    const token = request.headers.authorization
    try {
        const database = (request['database'] || '')
        const article = await getArticleById(id_article, database);
        const movementOfArticle = await getMovementsOfArticle(database)
        const movementOfCash = await getMovementsOfCash(database)
        if (!article) {
            return res.status(404).json({ message: 'Article no encontrado' });
        }
        const printer = await getPrinters(database)
        // const printer = printers.find((printerAux: any )=> printerAux.printIn === 'Etiqueta');

        if (!printer) {
            return res.status(404).json({ message: 'No se encontró la impresora, debe crear una impresora de tipo etiqueta' });
        }

        const pdfDataUri = await buildPrint(printer, article, movementOfArticle, movementOfCash, token);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');
        res.send(pdfDataUri);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}