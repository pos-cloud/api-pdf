import { Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getTransactionById } from "../services/transaction.service";
import { getPrinters } from "../services/printers.services";
import { getConfig } from "../services/config.services";
const { jsPDF } = require("jspdf");
import { formatDate } from "../utils/formateDate";
import { padString } from "./../utils/padString";
import { getCompanyPictureData } from "./../services/getPicture.service";
import { getMovementsOfArticle } from "./../services/movements-of-articles.services";
import Transaction from "./../models/transaction";
import Config from "./../models/config";
import { calculateQRAR } from "./../utils/calculateQRAR";
import { transform } from "../utils/round-number";
const sharp = require('sharp');
const fs = require('fs');

const header = async (doc: any, transaction: Transaction, config: Config, imgLogo: string) => {
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
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold");

  doc.line(6, 72, 205, 72, "FD"); // Linea Horizontal
  doc.line(6, 72, 6, 78, "FD"); // Linea Vertical
  doc.line(205, 72, 205, 78, "FD"); // Linea Vertical
  doc.line(6, 78, 205, 78, "FD"); // Linea Horizontal

  //colunas
  doc.line(20, 72, 20, 78, "FD"); // Linea Vertical
  doc.line(60, 72, 60, 78, "FD"); // Linea Vertical
  doc.line(130, 72, 130, 78, "FD"); // Linea Vertical
  doc.line(160, 72, 160, 78, "FD"); // Linea Vertical
  doc.line(180, 72, 180, 78, "FD"); // Linea Vertical

  doc.text('Cant.', 9, 76)
  doc.text('Código', 24, 76)
  doc.text('Descripción', 65, 76)
  doc.text('Precio unitario', 132, 76)
  doc.text('IVA', 163, 76)
  doc.text('Precio total', 182, 76)

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

  doc.setFontSize(20);

  doc.text(transaction.letter, 104.5, 14);
  doc.text(transaction.type.name, 130, 16);

  if (typeof imgLogo !== "undefined") {
    doc.addImage(imgLogo, 'JPEG', 15, 8, 45, 16)
  } else {
    doc.text(config.companyName, 15, 16);
  }

  doc.setFont("helvetica", "normal");

  doc.setFontSize(8);

  if (transaction.type.codes && config.country === 'AR') {
    for (let i = 0; i < transaction.type.codes.length; i++) {
      if (
        transaction.type.codes[i].code &&
        transaction.letter === transaction.type.codes[i].letter
      ) {
        doc.setFontSize(8);
        doc.text(
          'Cod:' + padString(transaction.type.codes[i].code.toString(), 2),
          101.4,
          18,
        );
      }
    }
  }
}

async function footer(doc: any, transaction: Transaction, qrDate: string) {
  doc.line(6, 208, 205, 208, "FD"); // Linea Horizontal
  doc.line(6, 208, 6, 250, "FD"); // Linea Vertical
  doc.line(205, 208, 205, 250, "FD"); // Linea Vertical
  doc.line(6, 250, 205, 250, "FD"); // Linea Horizontal

  doc.addImage(qrDate, 'png', 10, 251, 43, 43);

  doc.setFontSize(10)
  doc.text('Importe Neto Gravado:', 130, 215)
  doc.text('Subtotal:', 130, 221)
  doc.text('Descuento:', 130, 227)
  doc.text('Total:', 130, 233)
  doc.setFontSize(10)

  doc.text(`$${transaction.taxes[0].taxBase}` ?? '', 182, 215)
  doc.text(`$${transaction.totalPrice}` ?? '', 182, 221)
  doc.text(`$ (${transform(transaction.discountAmount / (1 + transaction.taxes[0].percentage / 100), 2)})` ?? '', 182, 227)
  doc.text(`$${transaction.totalPrice} ` ?? '', 182, 233)

  doc.setFont("helvetica", "bold");
  doc.text(`CAE N°: ${transaction?.CAE || ''}`, 140, 260)
  doc.text(transaction.CAEExpirationDate !== undefined ? `Fecha de Vto. CAE: ${formatDate(transaction?.CAEExpirationDate)}` : 'Fecha de Vto. CAE:', 119.4, 266)
}

export async function getPrintTransaction(
  req: RequestWithUser,
  res: Response
) {
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

    const qrDate = await calculateQRAR(transaction, config)

    const movements = await getMovementsOfArticle(transactionId, token)

    const pageWidth = printers.pageWidth;
    const pageHigh = printers.pageHigh;
    const units = "mm";
    const orientation = printers.orientation;
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    // if (config.companyPicture !== 'default.jpg') {
    const imgLogo = await getCompanyPictureData(config.companyPicture, token)
    const imageBuffer = Buffer.from(imgLogo, 'base64');
    const optimizedImageBuffer = await sharp(imageBuffer).jpeg({ quality: 70 }).toBuffer();
    // } else {
    //   doc.text(config.companyName, 15, 16);
    // }


    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (movements) {
      let verticalPosition = 84;
      let articlesPerPage = 20;
      let articlesOnCurrentPage = 0;

      for (let i = 0; i < movements.length; i++) {
        const movimiento = movements[i];

        if (articlesOnCurrentPage >= articlesPerPage) {
          header(doc, transaction, config, optimizedImageBuffer);
          footer(doc, transaction, qrDate);
          doc.addPage();
          verticalPosition = 84;
          articlesOnCurrentPage = 0;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text(`${movimiento.amount}`, 9, verticalPosition);
        doc.text(movimiento.code, 21, verticalPosition);
        doc.text(movimiento.description, 61, verticalPosition);
        doc.text(`$${movimiento.unitPrice.toFixed(2).replace('.', ',')}`, 135, verticalPosition);
        doc.text(movimiento.taxes[0]?.percentage !== undefined ? `${movimiento.taxes[0]?.percentage}%` : "", 164, verticalPosition);
        doc.text(`$${movimiento.salePrice.toFixed(2).replace('.', ',')}`, 182, verticalPosition);

        verticalPosition += 6;
        articlesOnCurrentPage++;
      }
      header(doc, transaction, config, optimizedImageBuffer);
      footer(doc, transaction, qrDate);
    }

    doc.autoPrint();
    doc.save(`transaction-${transactionId}.pdf`)

    const pdfPath = `transaction-${transactionId}.pdf`;

    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      res.setHeader('Content-Disposition', `inline; filename=./transaction-${transactionId}.pdf`);

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
  }
}