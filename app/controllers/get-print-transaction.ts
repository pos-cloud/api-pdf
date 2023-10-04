import { Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getTransactionById } from "../services/transaction.service";
import { getPrinters } from "../services/printers.services";
import { getConfig } from "../services/config.services";
import { formatDate } from "../utils/formateDate";
import { padString } from "../utils/padString";
import { getMovementsOfArticle } from "../services/movements-of-articles.services";
import Transaction from "../models/transaction";
import Config from "../models/config";
import { calculateQRAR } from "../utils/calculateQRAR";
import { transform, numberDecimal } from "../utils/format-numbers";
import { getMovementsOfCash } from "../services/movements-of-cash.service";
import MovementOfCash from "models/movement-of-cash";
const fs = require('fs');
const { jsPDF } = require("jspdf");

const header = async (doc: any, transaction: Transaction, config: Config) => {
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
  doc.line(53, 72, 53, 78, "FD"); // Linea Vertical
  doc.line(136, 72, 136, 78, "FD"); // Linea Vertical
  doc.line(168, 72, 168, 78, "FD"); // Linea Vertical
  doc.line(180, 72, 180, 78, "FD"); // Linea Vertical

  doc.text('Cant.', 9, 76)
  doc.text('Código', 24, 76)
  doc.text('Descripción', 55, 76)
  doc.text('Precio unitario', 140, 76)
  doc.text('IVA', 171, 76)
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
  doc.text(`Razón Social: ${transaction.company?.name || ""}`, 100, 57);
  doc.text(`Domicilio Comercial:  ${transaction.company?.address || ""}`, 100, 62);

  doc.setFontSize(20);

  doc.text(transaction.letter, 104.5, 14);
  doc.text(transaction.type.name, 130, 16);

  doc.setFontSize(8);

  if (transaction.type.codes && config.country === 'AR') {
    for (let i = 0; i < transaction.type.codes.length; i++) {
      if (
        transaction.type.codes[i].code &&
        transaction.letter === transaction.type.codes[i].letter
      ) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(
          'Cod.' + padString(transaction.type.codes[i].code.toString(), 2),
          102.4,
          18,
        );
      }
    }
  }
}

async function footer(doc: any, transaction: Transaction, qrDate: string, movementsOfCash: MovementOfCash[]) {
  doc.line(6, 225, 205, 225, "FD"); // Linea Horizontal
  doc.line(6, 225, 6, 290, "FD"); // Linea Vertical
  doc.line(205, 225, 205, 290, "FD"); // Linea Vertical
  doc.line(6, 290, 205, 290, "FD"); // Linea Horizontal

  doc.line(8, 227, 133, 227, "FD"); // Linea Horizontal
  doc.line(8, 227, 8, 231, "FD"); // Linea Vertical
  doc.line(133, 227, 133, 231, "FD"); // Linea Vertical
  doc.line(8, 231, 133, 231, "FD"); // Linea Horizontal

  doc.line(43, 227, 43, 231, "FD"); // Linea Vertical
  doc.line(110, 227, 110, 231, "FD"); // Linea Vertical


  doc.setFontSize(10)
  doc.setFont("helvetica", "bold");
  doc.text('Forma de pago', 10, 230)
  doc.text('Detalle', 45, 230)
  doc.text('Importe', 112, 230)

  doc.setFont("helvetica", "normal");

  let verticalPosition = 235;
  for (let i = 0; i < movementsOfCash.length; i++) {

    doc.text(movementsOfCash[i].type.name, 10, verticalPosition)
    doc.text(`$${numberDecimal(movementsOfCash[i].amountPaid)}`, 112, verticalPosition)
    movementsOfCash[i].observation.length > 0
      ? doc.text(`${movementsOfCash[i].observation.slice(0, 37)}-`, 44, verticalPosition)
      : '';
    if (movementsOfCash[i].observation.length > 35) {
      doc.text(`${movementsOfCash[i].observation.slice(37, 105)}-`, 44, (verticalPosition + 4)) || '';
      verticalPosition += 8;
    } else {
      verticalPosition += 4;
    }
  }

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold");
  doc.text('Importe Neto Gravado:', 138, 235)
  doc.text('Subtotal:', 138, 241)
  doc.text('Descuento:', 138, 247)
  doc.text('Total:', 138, 253)

  doc.setFont("helvetica", "normal");
  doc.text(`$${numberDecimal(transaction.taxes[0].taxBase)}` || '', 179, 235)
  doc.text(`$${numberDecimal(transaction.totalPrice)}` || '', 179, 241)
  doc.text(`$ (${transform(transaction.discountAmount / (1 + transaction.taxes[0].percentage / 100), 2)})` || '', 179, 247)
  doc.text(`$${numberDecimal(transaction.totalPrice)} ` || '', 179, 253)

  if (transaction.CAE && transaction.CAEExpirationDate) {
    doc.addImage(qrDate, 'png', 9, 251, 35, 35);
    doc.setFont("helvetica", "bold");
    doc.text(`CAE N°: ${transaction?.CAE || ''}`, 45, 277)
    doc.text(transaction.CAEExpirationDate !== undefined ? `Fecha de Vto. CAE: ${formatDate(transaction?.CAEExpirationDate)}` : 'Fecha de Vto. CAE:', 45, 282)
  }

  if (transaction.observation.length > 0) {
    doc.text('Observaciones:', 45, 259)
    doc.setFont("helvetica", "normal");
    let row = 259;
    transaction.observation.length > 0
      ? doc.text(transaction.observation.slice(0, 45) + '-', 72, row)
      : '';
    transaction.observation.length > 45
      ? doc.text(transaction.observation.slice(45, 105) + '-', 45, (row += 4))
      : '';
  }
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

    const movementsOfArticles = await getMovementsOfArticle(transactionId, token)

    const movementsOfCash = await getMovementsOfCash(token, transactionId)

    const pageWidth = printers.pageWidth;
    const pageHigh = printers.pageHigh;
    const units = "mm";
    const orientation = printers.orientation;
    const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (movementsOfArticles) {
      let verticalPosition = 84;
      let articlesPerPage = 36;
      let articlesOnCurrentPage = 0;
      let currentPage = 1;

      for (let i = 0; i < movementsOfArticles.length; i++) {
        const movementsOfArticle = movementsOfArticles[i];
        if (articlesOnCurrentPage >= articlesPerPage) {
          header(doc, transaction, config);

          if (i !== movementsOfArticles.length - 1) {
            doc.addPage();
            currentPage++;
            verticalPosition = 84;
            articlesOnCurrentPage = 0;
          }
        }

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);

        doc.text(movementsOfArticle.notes || "", 55, verticalPosition + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(`${movementsOfArticle.amount}`, 9, verticalPosition);
        doc.text(movementsOfArticle.code, 21, verticalPosition);
        doc.text(movementsOfArticle.description, 55, verticalPosition);
        doc.text(`$${numberDecimal(movementsOfArticle.unitPrice)}`, 149, verticalPosition);
        doc.text(movementsOfArticle.taxes[0]?.percentage !== undefined ? `${movementsOfArticle.taxes[0]?.percentage}%` : "", 171, verticalPosition);
        doc.text(`$${numberDecimal(movementsOfArticle.salePrice)}`, 189, verticalPosition);

        if (movementsOfArticle.notes) {
          verticalPosition += 9;
          articlesOnCurrentPage++;
        } else {
          verticalPosition += 6;
          articlesOnCurrentPage++;
        }
      }
      header(doc, transaction, config);
      footer(doc, transaction, qrDate, movementsOfCash);
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