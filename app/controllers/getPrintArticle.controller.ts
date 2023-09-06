import { Response } from "express";
import { getArticleById } from "../services/article.services";
import { getPrinters } from "../services/printers.services";
import RequestWithUser from "interfaces/requestWithUser.interface";
const { jsPDF } = require("jspdf");

export async function getPrintArticle(
  req: RequestWithUser,
  res: Response
) {
  const database: string = req.database;
  const articleId: string = req.query.articleId as string;

  try {
    const article = await getArticleById(articleId, database);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const printers = await getPrinters(database, "Etiqueta");
    const printer = printers[0];

    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }

    const pageWidth = printer.pageWidth;
    const pageHigh = printer.pageHigh;
    const units = 'mm';
    const orientation = printer.orientation;
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);


    doc.text("Hola, este es un PDF generado desde Node.js con jsdoc.", 10, 10);

    doc.autoPrint();
    const pdfBase64 = doc.output("datauristring");
    return res.status(200).send({ pdfBase64 });

    // console.log(printer);
    // const printer = printers.find((printerAux: any )=> printerAux.printIn === 'PrinterPrintIn.Label');

    // if (!printer) {
    //     return res.status(404).json({ message: 'No se encontró la impresora, debe crear una impresora de tipo etiqueta' });
    // }
    // const pageWidth = printer.pageWidth;
    // const pageHigh = printer.pageHigh;
    // const units = 'mm';
    // const orientation = printer.orientation;
    // const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    // if (printer.quantity) {
    //     await buildLayout(doc, PositionPrint.Header, printer, article, token);
    //     for (let index = 0; index < printer.quantity - 1; index++) {
    //         doc.addPage();
    //         await buildLayout(doc, PositionPrint.Header, printer, article, token);
    //     }
    // } else {
    //     await buildLayout(doc, PositionPrint.Header, printer, article, token);
    //     await buildLayout(doc, PositionPrint.Footer, printer, article, token);
    //     if (printer.quantity && printer.quantity > 1) {
    //         for (let index = 0; index < printer.quantity - 1; index++) {
    //             doc.addPage();
    //             await buildLayout(doc, PositionPrint.Header, printer, article, token);
    //             await buildLayout(doc, PositionPrint.Footer, printer, article, token);
    //         }
    //     }
    // }

    // const pdfDataUri = doc.output('datauristring');
    // doc.autoPrint()
    // res.status(200).json({data: pdfDataUri})

    // async function buildLayout(doc: any , position: PositionPrint, printer: Printer, article: any, token: any) {
    //     for (const field of printer.fields) {
    //         if (position && position === field.position) {
    //             switch (field.type) {
    //                 case 'label':
    //                     if (field.font !== 'default') {
    //                         doc.setFont(field.font);
    //                     }
    //                     doc.setFont('', field.fontType);
    //                     doc.setFontSize(field.fontSize);
    //                     doc.text(field.positionStartX, field.positionStartY, field.value);
    //                     break;
    //                 case 'line':
    //                     doc.setLineWidth(field.fontSize);
    //                     doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
    //                     break;
    //                 case 'image':
    //                     try {
    //                         const img = await getCompanyPicture(eval(field.value));
    //                         doc.addImage(img, 'jpeg', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
    //                     } catch (error) {
    //                         console.log(error)
    //                     }
    //                     break;
    //                 case 'barcode':
    //                     try {
    //                         const response = await getBarcode64('code128', eval(field.value));
    //                         doc.addImage(response, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
    //                     } catch (error) {
    //                        console.log(error)
    //                     }
    //                     break;
    //                 case 'data':
    //                     if (field.font !== 'default') {
    //                         doc.setFont(field.font);
    //                     }
    //                     doc.setFont('', field.fontType);
    //                     doc.setFontSize(field.fontSize);

    //                     try {
    //                         const text = field.positionEndX || field.positionEndY
    //                             ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
    //                             : eval(field.value).toString();
    //                         doc.text(field.positionStartX, field.positionStartY, text);
    //                     } catch (e) {
    //                         doc.text(field.positionStartX, field.positionStartY, " ");
    //                     }
    //                     break;
    //                 case 'dataEsp':
    //                     if (field.font !== 'default') {
    //                         doc.setFont(field.font);
    //                     }
    //                     doc.setFont('', field.fontType);
    //                     doc.setFontSize(field.fontSize);

    //                     try {
    //                         const text = field.positionEndX || field.positionEndY
    //                             ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
    //                             : eval(field.value).toString();

    //                         doc.text(field.positionStartX, field.positionStartY, text);
    //                     } catch (e) {
    //                         doc.text(field.positionStartX, field.positionStartY, " ");
    //                     }
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //     }
    //     return true;
    // }

    // async function getCompanyPicture(img: string) {
    //     try {
    //         const response: any = await getCompanyPictureData(img)
    //         if (!response) {
    //             return 'error'
    //         } else {
    //             let imageURL = 'data:image/jpeg;base64,' + response;
    //             return imageURL
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // async function getBarcode64(barcode: string, token: any) {
    //     try {
    //         const barcodeData = await getBarcode(barcode, token);
    //         if (!barcodeData) {
    //             return false
    //         } else {
    //             const barcode64 = barcodeData;
    //             const imageURL = 'data:image/png;base64,' + barcode64;
    //             return imageURL
    //         }
    //     } catch (error) {
    //         return error
    //     }
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
