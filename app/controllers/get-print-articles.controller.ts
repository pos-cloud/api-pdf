import { getConfig } from "../services/config.services";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { Response } from "express";
import { getArticlesData } from "../services/article.services";
import { formatNumber, transform } from "../utils/format-numbers";
import { getmake } from "../services/make.services";
import { ObjectId } from "mongodb";
const { jsPDF } = require("jspdf");
const fs = require('fs');

export async function getPrintArticles(
  req: RequestWithUser,
  res: Response) {
  const token = req.headers.authorization
  const database = req.database
  try {
    const id = req.body
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }

    const configs = await getConfig(token);
    const config = configs[0]
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    const objectIdArray = id.map((ids: any) => new ObjectId(ids));
   
    const articles = await getArticlesData(token,
      {
        match:
          { _id: { $in: objectIdArray } },
      })
    if (!articles) {
      return res.status(404).json({ message: "Articles not found" });
    }
    const pageWidth = 210;
    const pageHigh = 297;
    const units = 'mm';
    const orientation = 'p';
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    let x = 15
    let y = 10
    //set counter
    let count = 1
    //set date
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes()

    for (let articleItem of articles) {
      let salePriceTransform = transform(articleItem.salePrice)
      doc.rect(x, y, 60, 30.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(30);
      doc.text(x + 5, y + 12, `$${formatNumber(salePriceTransform)}`);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      articleItem.description.length > 0
        ? doc.text(articleItem.description.slice(0, 30) + '-', x + 1, y + 20)
        : ''
      articleItem.description.length > 30
        ? doc.text(articleItem.description.slice(30, 58) + '-', x + 1, (y + 23))
        : '';
      articleItem.description.length > 58
        ? articleItem.description.slice(58, 105)
        : '';
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(x + 1, y + 29, config.companyFantasyName);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(x + 40, y + 29, datetime);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const make = await getmake(articleItem.make, database)

      if (make) {
        doc.text(x + 1, y + 26, make.description || '');
      }
      //validate position
      if (x >= 110) {
        x = 15
        y += 30.5
      } else {
        x += 60
      }
      if (count === 27) {
        doc.addPage()
        x = 15
        y = 10
        count = 1
      } else {
        count++
      }
    }

    doc.autoPrint();
    doc.save(`article-${database}.pdf`)

    const pdfPath = `article-${database}.pdf`;

    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      res.setHeader('Content-Disposition', `inline; filename=./article-f.pdf`);

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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
}