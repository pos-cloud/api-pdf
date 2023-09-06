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
        
        doc.text('Prueba',10, 10)
        doc.autoPrint();
        const pdfBase64 = doc.output("datauristring")
        return res.status(200).send({ pdfBase64 });
        
    } catch (error) {
   console.log(error)
    }
}