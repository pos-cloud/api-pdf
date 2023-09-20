import { Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getTransactionById } from "../services/transaction.service";
import { getPrinters } from "../services/printers.services";
import { getConfig } from "../services/config.services";
const { jsPDF } = require("jspdf");
import { formatDate } from "../utils/formateDate";
import { padString } from "../utils/padString";
import { getCompany } from "../services/company.services";
import { getVatCondition } from "../services/vat-condition.services";
import { getTransactionTypeById } from "../services/transaction-types.services";
import { getCompanyPictureData } from "../services/getPicture.service";

export async function getPrintTransaction(
    req: RequestWithUser,
    res: Response
) {
    const database: string = req.database;
    const transactionId: string = req.query.transactionId as string;
    const token = req.headers.authorization

    try {
        const configs = await getConfig(token);
       const config = configs[0]
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
      
        const transaction = await getTransactionById(transactionId, token);
    
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const printers = await getPrinters(token, "Mostrador");

        if (!printers) {
            return res.status(404).json({ message: "Printer not found" });
        }

        const pageWidth = printers.pageWidth;
        const pageHigh = printers.pageHigh;
        const units = "mm";
        const orientation = printers.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

        // doc.line(6, 6, 205, 6, "FD"); // Linea Horizontal
        doc.line(6, 6, 6, 48, "FD"); // Linea Vertical
        doc.line(205, 6, 205, 48, "FD"); // Linea Vertical
        doc.line(6, 48, 205, 48, "FD"); // Linea Horizontal
        doc.line(6, 6, 205, 6, "FD"); // Linea Horizontal

        doc.line(107, 20, 107, 48); // Linea Vertical Medio
        doc.line(99, 20, 115, 20, "FD"); // Linea Horizontal Medio
        doc.line(99, 6, 99, 20, "FD"); // Linea Vertical Medio
        doc.line(115, 6, 115, 20, "FD"); // Linea Vertical Medio
        doc.line(99, 6, 115, 6, "FD"); // Linea Horizontal Medio

        doc.line(6, 51, 205, 51, "FD"); // Linea Horizontal
        doc.line(6, 51, 6, 70, "FD"); // Linea Vertical
        doc.line(205, 51, 205, 70, "FD"); // Linea Vertical
        doc.line(6, 70, 205, 70, "FD"); // Linea Horizontal

        //CONTENIDO
                //CONTENIDO
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold");

        doc.line(6, 72, 205, 72, "FD"); // Linea Horizontal
        doc.line(6, 72, 6, 78, "FD"); // Linea Vertical
        doc.line(205, 72, 205, 78, "FD"); // Linea Vertical
        doc.line(6, 78, 205, 78, "FD"); // Linea Horizontal
    
        //colunas
        doc.line(30, 72, 30, 78, "FD"); // Linea Vertical
        doc.line(88, 72, 88, 78, "FD"); // Linea Vertical
        doc.line(132, 72, 132, 78, "FD"); // Linea Vertical
        doc.line(170, 72, 170, 78, "FD"); // Linea Vertical

        doc.text('Código', 9, 76)
        doc.text('Descripción', 32, 76)
        doc.text('Precio unitario', 90, 76)
        doc.text('IVA', 135, 76)
        doc.text('Precio total', 174, 76)
        
        doc.setFontSize(20);

        doc.text(transaction.letter, 104.5, 14);
        doc.setFontSize(20);
        if (config.companyPicture !== 'default.jpg') {
          const img = await getCompanyPictureData(config.companyPicture, token)
    
          doc.addImage(img, 'JPEG', 15, 8, 45, 16)
        } else {
          doc.text(config.companyName, 15, 16);
        }
       
        doc.text(transaction.type.name, 130, 16);
        doc.setFont("helvetica", "normal");

        // Labels Primer Cuadro
        doc.setFontSize(8);
        if (transaction.type.codes && config.country === 'AR') {
            
            for (let i = 0; i < transaction.type.codes.length; i++) {
              if (
                transaction.type.codes[i].code &&
                transaction.letter === transaction.type.codes[i].letter
              ) {
                doc.setFontSize('8');
                doc.text(
                  'Cod:' + padString(transaction.type.codes[i].code.toString(), 2),
                  101.4,
                  18,
                );
              }
            }
          }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`Razón Social:  ${config.companyName}`, 9, 28);
        doc.text(`Domicilio Comercial:   ${config.companyAddress}`, 9, 35);
        doc.text(`Condición de IVA:   ${config.companyVatCondition?.description || ""}`, 9, 42);
        doc.text(`Punto de Venta: ${padString(transaction.origin, 4)}`, 120, 26);
        doc.text(`Comp. Nro: ${padString(transaction.number, 10)}`, 165, 26);
        doc.text(`Fecha de Emición: ${formatDate(transaction.startDate)} `, 120, 30);

        doc.text(`C.U.I.T: ${config.companyIdentificationValue}`, 120, 38);
        doc.text(`Ingresos Brutos: ${config.companyGrossIncome}`, 120, 42);
        doc.text(`Inicio de Actividades: ${formatDate(config.companyStartOfActivity)}`, 120, 46);

        // Labels Segundo Cuadro
        doc.setFontSize(8.9);
        doc.text(`C.U.I.T: ${transaction.company?.CUIT || ""}`, 9, 57);
        doc.text(`Condición de IVA: ${transaction.VatCondition?.description || "Consumidor Final"}`, 9, 62);
        doc.text(`Condición de venta:`, 9, 67);
        doc.text(`Apellido y Nombre / Razón Social: ${transaction.company?.name || ""}`, 100, 57);
        doc.text(`Domicilio Comercial:  ${transaction.company?.address || ""}`, 100, 62);

        doc.autoPrint();
        const pdfBase64 = doc.output("datauristring");
        return res.status(200).send({ pdfBase64 });
    } catch (error) {
        console.log(error);
    }
}