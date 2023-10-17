import { getConfig } from "../services/config.services";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { Response } from "express";
import { getPrinters } from "../services/printers.services";
import { getItem } from "../services/articleV2.services";
const { jsPDF } = require("jspdf");
const fs = require('fs');

export async function getListArticles(
    req: RequestWithUser,
    res: Response) {
      const token = req.headers.authorization
    
      try {
        const configs = await getConfig(token);
        const config = configs[0]
      
       const items = await getItem(token)
        if (!config) {
          return res.status(404).json({ message: "Config not found" });
        }
       
        const printer = await getPrinters(token, "Etiqueta");
    
        if (!printer) {
          return res.status(404).json({ message: "Printer not found" });
        }
    
        const pageWidth = 210;
        const pageHigh = 297;
        const units = 'mm';
        const orientation =  'p';
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
    
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

      for (let articleItem of items){
        doc.rect(x, y, 60, 30.5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(30);
        doc.text(x+5, y+13, "$"+articleItem.salePrice);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(x+1, y+23, `${articleItem.description}`);
        doc.text(x+1, y+26, articleItem.make.description);
        doc.setFontSize(7);
        doc.text(x+1, y+29, `${articleItem.barcode}`);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setFont('helvetica', 'bold');
        doc.text(x+20, y+29, config.companyFantasyName);
        doc.setFont('helvetica', 'normal');
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

      doc.autoPrint();
      doc.save(`article-f.pdf`)
  
      const pdfPath = `article-f.pdf`;
  
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
}catch(err){
  console.log(err);
  res.status(500).json({ message: "Internal server error", error: err });
}
    }