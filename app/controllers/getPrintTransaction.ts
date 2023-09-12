import { Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getTransactionById } from "../services/transaction.service";
import { getPrinters } from "../services/printers.services";
import { getConfig } from "../services/config.services";
const { jsPDF } = require("jspdf");
import { formatDate } from "../utils/formateDate";
import { padString } from "../utils/padString";

export async function getPrintTransaction(
    req: RequestWithUser,
    res: Response) {
    const database: string = req.database;
    const transactionId: string = req.query.transactionId as string;

    try {
        const config = await getConfig(database)
        if(!config){
            console.log(config)
            return res.status(404).json({ message: "Config not found"})
        }

        const transaction = await getTransactionById(transactionId, database);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const printers = await getPrinters(database, "Mostrador");
        const printer = printers[0];
    
        if (!printer) {
          return res.status(404).json({ message: "Printer not found" });
        }
    
        const pageWidth = printer.pageWidth;
        const pageHigh = printer.pageHigh;
        const units = 'mm';
        const orientation = printer.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        

        doc.line(6, 6, 205, 6, 'FD');// Linea Horizontal
        doc.line(6, 6, 6, 57, 'FD');// Linea Vertical
        doc.line(205, 6 , 205, 57, 'FD');// Linea Vertical
        doc.line(6, 57, 205, 57, 'FD');// Linea Horizontal
        doc.line(6, 15, 205, 15, 'FD');// Linea Horizontal

        doc.line(107, 29, 107, 57);// Linea Vertical Medio
        doc.line(99, 29, 115, 29, 'FD');// Linea Horizontal Medio
        doc.line(99, 15, 99, 29, 'FD');// Linea Vertical Medio
        doc.line(115, 15, 115, 29, 'FD');// Linea Vertical Medio
        doc.line(99, 15, 115, 15, 'FD');// Linea Horizontal Medio

        doc.line(6, 60, 205, 60, 'FD');// Linea Horizontal
        doc.line(6, 60, 6, 80, 'FD');// Linea Vertical
        doc.line(205, 60, 205, 80, 'FD');// Linea Vertical
        doc.line(6, 80, 205, 80, 'FD');// Linea Horizontal

        doc.setFont("helvetica", "bold");
        doc.text('ORIGINAL', 94, 12.2)
        doc.setFontSize(20);

        doc.text(transaction.letter, 104.5, 23)
        doc.setFontSize(20);
        doc.text(config[0].companyName, 15, 26)
        doc.text('FACTURA', 130, 25)
        doc.setFont("helvetica", "normal");
        

        //Labels Primer Cuadro
         doc.setFontSize(8)
        doc.setFont("helvetica", "bold");
        doc.text('COD. ' + padString(config[0].companyVatCondition.code, 2), 101.4, 27)

        doc.setFontSize(9);
        doc.text('Razón Social:', 9, 36)
        doc.text('Domicilio Comercial:', 9, 45)
        doc.text('Condicion frente al IVA:', 9, 55)

        doc.text('Comp. Nro:', 165, 32)
        doc.text('Punto de Venta:', 120, 32)
        doc.text('Fecha de Emición:', 120, 37)
        
        doc.text('CUIT:', 120, 46)
        doc.text('Ingresos Brutos:', 120, 50)
        doc.text('Fecha de Inicio de Actividades:', 120, 55)

        //Labels Segundo Cuadro
        doc.setFontSize(8.9);
        doc.text('CUIT:', 9, 64)
        doc.text('Condicion frente al IVA:', 9, 70)
        doc.text('Condicion de venta:', 9, 77)
        doc.text('Apellido y Nombre / Razón Social:', 100, 64)
        doc.text('Domicilio Comercial:', 100, 70)

        // Datos primer cuadro
        doc.setFont("helvetica", "normal");
        doc.text(config[0].companyName, 31, 36)
        doc.text(config[0].companyAddress, 42, 45)
        doc.text(config[0].companyVatCondition.description, 46, 55)
        doc.text(config[0].companyIdentificationValue, 130, 46)
        doc.text(config[0].companyGrossIncome, 146, 50)
        doc.text(formatDate(config[0].companyStartOfActivity), 169, 55)
        doc.text(formatDate(transaction.startDate), 149, 37)
        doc.text(padString(transaction.number, 10), 184, 32)
        doc.text(padString(transaction.origin, 4), 147, 32)

        //Datos segundo cuadro
        doc.text(transaction.company.CUIT, 18, 64)
        doc.text(transaction.company.vatCondition.description, 46, 70)
        doc.text(transaction.company.name, 153, 64)
        doc.text(transaction.company.address, 132, 70)
        
        doc.save('Factura.pdf')
        doc.autoPrint();
        const pdfBase64 = doc.output("datauristring")
        return res.status(200).send({ pdfBase64 });
        
    } catch (error) {
   console.log(error)
    }
}