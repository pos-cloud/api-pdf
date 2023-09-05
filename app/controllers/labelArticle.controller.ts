import { Request, Response } from 'express';
import request from '../interfaces/request.interface'
import { getArticleById } from "../services/article.services";
import { getPrinters } from '../services/printers.services';
import jsPDF from 'jspdf';
import { PositionPrint, Printer } from '../utils/print.enum';
const { getBarcode } = require('../utils/getBarcode');
const { getCompanyPictureData } = require('../utils/getPicture')

export async function getArticleLabelController(request: request, res: Response) {
    const { id_article } = request.body;
    try {
        const database = (request['database'] || '')
        const article = await getArticleById(id_article, database);
        const token = request.headers.authorization
        if (!article) {
            return res.status(404).json({ message: 'Article no encontrado' });
        }
        const printer = await getPrinters(database)
        // const printer = printers.find((printerAux: any )=> printerAux.printIn === 'PrinterPrintIn.Label');

        if (!printer) {
            return res.status(404).json({ message: 'No se encontró la impresora, debe crear una impresora de tipo etiqueta' });
        }
        const pageWidth = printer.pageWidth;
        const pageHigh = printer.pageHigh;
        const units = 'mm';
        const orientation = printer.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

        if (printer.quantity) {
            await buildLayout(doc, PositionPrint.Header, printer, article, token);
            for (let index = 0; index < printer.quantity - 1; index++) {
                doc.addPage();
                await buildLayout(doc, PositionPrint.Header, printer, article, token);
            }
        } else {
            await buildLayout(doc, PositionPrint.Header, printer, article, token);
            await buildLayout(doc, PositionPrint.Footer, printer, article, token);
            if (printer.quantity && printer.quantity > 1) {
                for (let index = 0; index < printer.quantity - 1; index++) {
                    doc.addPage();
                    await buildLayout(doc, PositionPrint.Header, printer, article, token);
                    await buildLayout(doc, PositionPrint.Footer, printer, article, token);
                }
            }
        }

        const pdfDataUri = doc.output('datauristring');
        doc.autoPrint()
        doc.save()
        res.status(200).json({data: pdfDataUri})

        async function buildLayout(doc: any , position: PositionPrint, printer: Printer, article: any, token: any) {
            for (const field of printer.fields) {
                if (position && position === field.position) {
                    switch (field.type) {
                        case 'label':
                            if (field.font !== 'default') {
                                doc.setFont(field.font);
                            }
                            doc.setFont('', field.fontType);
                            doc.setFontSize(field.fontSize);
                            doc.text(field.positionStartX, field.positionStartY, field.value);
                            break;
                        case 'line':
                            doc.setLineWidth(field.fontSize);
                            doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                            break;
                        case 'image':
                            try {
                                const img = await getCompanyPicture(eval(field.value));
                                doc.addImage(img, 'jpeg', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                            } catch (error) {
                                console.log(error)
                            }
                            break;
                        case 'barcode':
                            try {
                                const response = await getBarcode64('code128', eval(field.value));
                                doc.addImage(response, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                            } catch (error) {
                               console.log(error)
                            }
                            break;
                        case 'data':
                            if (field.font !== 'default') {
                                doc.setFont(field.font);
                            }
                            doc.setFont('', field.fontType);
                            doc.setFontSize(field.fontSize);

                            try {
                                const text = field.positionEndX || field.positionEndY
                                    ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
                                    : eval(field.value).toString();
                                doc.text(field.positionStartX, field.positionStartY, text);
                            } catch (e) {
                                doc.text(field.positionStartX, field.positionStartY, " ");
                            }
                            break;
                        case 'dataEsp':
                            if (field.font !== 'default') {
                                doc.setFont(field.font);
                            }
                            doc.setFont('', field.fontType);
                            doc.setFontSize(field.fontSize);

                            try {
                                const text = field.positionEndX || field.positionEndY
                                    ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
                                    : eval(field.value).toString();

                                doc.text(field.positionStartX, field.positionStartY, text);
                            } catch (e) {
                                doc.text(field.positionStartX, field.positionStartY, " ");
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            return true;
        }

        async function getCompanyPicture(img: string) {
            try {
                const response: any = await getCompanyPictureData(img)
                if (!response) {
                    return 'error'
                } else {
                    let imageURL = 'data:image/jpeg;base64,' + response;
                    return imageURL
                }
            } catch (error) {
                console.log(error)
            }
        }

        async function getBarcode64(barcode: string, token: any) {
            try {
                const barcodeData = await getBarcode(barcode, token);
                if (!barcodeData) {
                    return false
                } else {
                    const barcode64 = barcodeData;
                    const imageURL = 'data:image/png;base64,' + barcode64;
                    return imageURL
                }
            } catch (error) {
                return error
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}