import { Response } from "express";
import { getArticleData } from "../services/article.services";
import { getPrinters } from "../services/printers.services";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getBarcode } from "../utils/getBarcode";
import {getCompanyPictureFromGoogle } from "../services/get-picture.services";
import { getConfig } from "../services/config.services";
import { getItem } from "../services/articleV2.services";
const { jsPDF } = require("jspdf");
const fs = require('fs');

export async function getPrintArticle(
  req: RequestWithUser,
  res: Response
) {
  const token = req.headers.authorization
  const articleId: string = req.query.articleId as string;
  const quantity: string = req.query.quantity as string;

  try {
    const configs = await getConfig(token);
    const config = configs[0]
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    if(!quantity){
      return res.status(404).json({ message: "no quantity found" });
    }
    const article = await getArticleData(articleId, token);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const items = await getItem(token)
    
    const printer = await getPrinters(token, "Etiqueta");

    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }

    const pageWidth = printer.pageWidth;
    const pageHigh = printer.pageHigh;
    const units = 'mm';
    const orientation = printer.orientation;
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    if (quantity && parseInt(quantity) >= 1) {
      for (let index = 0; index < parseInt(quantity); index++) {
        if (index > 0) {
          doc.addPage();
        }
        if(printer.fields){
          for (const field of printer.fields) {
            switch (field.type) {
              case 'label':
                if (field.font !== 'default') {
                  doc.setFont(field.font, field.fontType);
                }
                doc.setFontSize(field.fontSize);
                doc.text(field.positionStartX, field.positionStartY, field.value);
                break;
              case 'line':
                doc.setLineWidth(field.fontSize);
                doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                break;
              case 'image':
                try {
                  //const img = await getCompanyPictureData(eval(field.value), token);
                  const img = await getCompanyPictureFromGoogle(eval(field.value));
                  doc.addImage(img, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                } catch (error) {
                  console.log(error);
                }
                break;
              case 'barcode':
                try {
                  const response = await getBarcode('code128', eval(field.value));
                  doc.addImage(response, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                } catch (error) {
                  console.log(error);
                }
                break;
              case 'data':
              case 'dataEsp':
                if (field.font !== 'default') {
                  doc.setFont(field.font, field.fontType);
                }
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
        }else{
          let x = 15
          let y = 10
          //set counter
          let count = 1
          //set date
          var currentdate = new Date(); 
          // var datetime = currentdate.getDate() + "/"
          //           + (currentdate.getMonth()+1)  + "/" 
          //           + currentdate.getFullYear() + " "
          //           + currentdate.getHours() + ":"  
          //           + currentdate.getMinutes() 
      
          //print each article
          for (let articleItem of items){
            //prepare label
            doc.rect(x, y, 60, 30.5);
            doc.setFont('', 'bold');
            doc.setFontSize(30);
            doc.text(x+5, y+13, "$"+articleItem.salePrice);
            doc.setFont('', 'normal');
            doc.setFontSize(9);
            doc.setFont('', 'italic');
            doc.text(x+1, y+23, articleItem.description);
            doc.text(x+1, y+26, articleItem.make.description);
            doc.setFontSize(7);
            doc.text(x+1, y+29, articleItem.barcode);
            doc.setFontSize(9);
            doc.setFont('', 'normal');
            doc.setFont('', 'bold');
            doc.text(x+20, y+29, config.companyFantasyName);
            doc.setFont('', 'normal');
            doc.setFontSize(7);
            // doc.text(x+44, y+29, datetime);
      
            //validate position
            if(x >= 110){
              x=15
              y+=30.5
            }else{
              x+=60
            }
            if(count === 27){
              doc.addPage()
              x = 15
              y = 10
              count = 1
            }else{
              count ++
            }
          }
        }
      }
    }

    doc.autoPrint();
    doc.save(`article-${articleId}.pdf`)

    const pdfPath = `article-${articleId}.pdf`;

    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      res.setHeader('Content-Disposition', `inline; filename=./article-${articleId}.pdf`);

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        fs.unlink(pdfPath, (err: any) => {
          if (err) {
            console.error(`Error al eliminar el archivo ${pdfPath}: ${err}`);
          } else {
            console.log(`Archivo ${pdfPath} eliminado con éxito.`);
          }
        });
      })
    } else {
      res.status(404).send('PDF no encontrado');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}