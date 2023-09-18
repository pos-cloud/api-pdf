import { Response } from "express";
import { getArticleData } from "../services/article.services";
import { getPrinters } from "../services/printers.services";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getBarcode } from "../utils/getBarcode";
import { getCompanyPictureData } from "../services/getPicture.service";
import { getConfig } from "../services/config.services";
import * as path from "path";
const { jsPDF } = require("jspdf");

export async function getPrintArticle(
  req: RequestWithUser,
  res: Response
) {
  const database: string = req.database;
  const articleId: string = req.query.articleId as string;
  const token = req.headers.authorization
  try {
    const configs = await getConfig(token);
    const config =configs[0]
    if(!config){
      return res.status(404).json({ message: "Config not found" });
    }
    const article = await getArticleData(articleId, token);
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

    for (const field of printer.fields) {
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
                const img = await getCompanyPictureData(eval(field.value), token);
                doc.addImage(img, 'JPEG', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
            } catch (error) {
                console.log(error)
            }
            break;
        case 'barcode':
          try {
            const response = await getBarcode('code128', eval(field.value));
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

    doc.autoPrint();
    doc.save('article.pdf')
    const pdfBase64 = doc.output("datauristring")
    return res.status(200).send({ pdfBase64 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
