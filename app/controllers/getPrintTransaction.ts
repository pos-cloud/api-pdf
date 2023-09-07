import { Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getTransactionById } from "../services/transaction.service";
import { getPrinters } from "../services/printers.services";
const { jsPDF } = require("jspdf");

export async function getPrintTransaction(
    req: RequestWithUser,
    res: Response) {
    const database: string = req.database;
    const transactionId: string = req.query.transactionId as string;

    try {
        const transsaction = await getTransactionById(transactionId, database);

        if (!transsaction) {
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
        

        doc.line(6, 6, 205, 6);// Linea Horizontal
        doc.line(6, 6, 6, 57);// Linea Vertical
        doc.line(205, 6 , 205, 57);// Linea Vertical
        doc.line(6, 57, 205, 57);// Linea Horizontal
        doc.line(6, 15, 205, 15);// Linea Horizontal

        doc.line(107, 29, 107, 57);// Linea Vertical Medio
        doc.line(99, 29, 115, 29);// Linea Horizontal
        doc.line(15, 30, 30, 57);// Linea Vertical

        doc.line(6, 60, 205, 60);// Linea Horizontal
        doc.line(6, 60, 6, 80);// Linea Vertical
        doc.line(205, 60, 205, 80);// Linea Vertical
        doc.line(6, 80, 205, 80);// Linea Horizontal

        doc.save('Factura.pdf')
        doc.autoPrint();
        const pdfBase64 = doc.output("datauristring")
        return res.status(200).send({ pdfBase64 });
        
    } catch (error) {
   console.log(error)
    }
}