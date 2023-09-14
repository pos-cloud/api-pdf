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

export async function getPrintTransaction(
    req: RequestWithUser,
    res: Response
) {
    const database: string = req.database;
    const transactionId: string = req.query.transactionId as string;

    try {
        const configs = await getConfig(database);
        const config = configs[0]
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }

        const transaction = await getTransactionById(transactionId, database);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const transactionType = await getTransactionTypeById(transaction.type, database)

        const company = await getCompany(database, transaction.company);

        const vatConditionsConfig = await getVatCondition(database, config.companyVatCondition);

        const vatConditionsCompa = company?.vatCondition;

        const vatConditionsCompany = await getVatCondition(database, vatConditionsCompa);

        const printers = await getPrinters(database, "Mostrador");
        const printer = printers[0];

        if (!printer) {
            return res.status(404).json({ message: "Printer not found" });
        }

        const pageWidth = printer.pageWidth;
        const pageHigh = printer.pageHigh;
        const units = "mm";
        const orientation = printer.orientation;
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

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);

        doc.text(transaction.letter, 104.5, 14);
        doc.setFontSize(20);
        doc.text(config.companyPicture !== 'default.jpg' ? config.companyPicture : config.companyName , 15, 16);
        doc.text(transactionType.name, 130, 16);
        doc.setFont("helvetica", "normal");

        // Labels Primer Cuadro
        doc.setFontSize(8);
        if (transactionType.codes && config.country === 'AR') {
            
            for (let i = 0; i < transactionType.codes.length; i++) {
              if (
                transactionType.codes[i].code &&
                transaction.letter === transactionType.codes[i].letter
              ) {
                doc.setFontSize('8');
                doc.text(
                  'Cod:' + padString(transactionType.codes[i].code.toString(), 2),
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
        doc.text(`Condición de IVA:   ${vatConditionsConfig?.description || ""}`, 9, 42);

        doc.text(`Punto de Venta: ${padString(transaction.origin, 4)}`, 120, 26);
        doc.text(`Comp. Nro: ${padString(transaction.number, 10)}`, 165, 26);
        doc.text(`Fecha de Emición: ${formatDate(transaction.startDate)} `, 120, 30);

        doc.text(`C.U.I.T: ${config.companyIdentificationValue}`, 120, 38);
        doc.text(`Ingresos Brutos: ${config.companyGrossIncome}`, 120, 42);
        doc.text(`Inicio de Actividades: ${formatDate(config.companyStartOfActivity)}`, 120, 46);

        // Labels Segundo Cuadro
        doc.setFontSize(8.9);
        doc.text(`C.U.I.T: ${company?.CUIT || ""}`, 9, 57);
        doc.text(`Condición de IVA: ${vatConditionsCompany?.description || "Consumidor Final"}`, 9, 62);
        doc.text(`Condición de venta:`, 9, 67);
        doc.text(`Apellido y Nombre / Razón Social: ${company?.name || ""}`, 100, 57);
        doc.text(`Domicilio Comercial:  ${company?.address || ""}`, 100, 62);

        doc.autoPrint();
        doc.save('factura.pdf')
        const pdfBase64 = doc.output("datauristring");
        return res.status(200).send({ pdfBase64 });
    } catch (error) {
        console.log(error);
    }
}