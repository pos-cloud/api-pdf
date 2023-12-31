"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTransaction = void 0;
const transaction_services_1 = require("../services/transaction.services");
const printers_services_1 = require("../services/printers.services");
const config_services_1 = require("../services/config.services");
const formateDate_1 = require("../utils/formateDate");
const padString_1 = require("../utils/padString");
const movements_of_articles_services_1 = require("../services/movements-of-articles.services");
const calculateQRAR_1 = require("../utils/calculateQRAR");
const format_numbers_1 = require("../utils/format-numbers");
const movements_of_cash_services_1 = require("../services/movements-of-cash.services");
const get_picture_services_1 = require("../services/get-picture.services");
const fs = require('fs');
const { jsPDF } = require("jspdf");
async function header(doc, transaction, config, movementsOfArticles) {
    var _a, _b, _c, _d, _e;
    doc.line(4, 6, 4, 48, "FD"); // Linea Vertical
    doc.line(205, 6, 205, 48, "FD"); // Linea Vertical
    doc.line(4, 48, 205, 48, "FD"); // Linea Horizontal
    doc.line(4, 6, 205, 6, "FD"); // Linea Horizontal
    doc.line(107, 20, 107, 48); // Linea Vertical Medio
    doc.line(99, 20, 115, 20, "FD"); // Linea Horizontal Medio
    doc.line(99, 6, 99, 20, "FD"); // Linea Vertical Medio
    doc.line(115, 6, 115, 20, "FD"); // Linea Vertical Medio
    doc.line(99, 6, 115, 6, "FD"); // Linea Horizontal Medio
    doc.line(4, 51, 205, 51, "FD"); // Linea Horizontal
    doc.line(4, 51, 4, 65, "FD"); // Linea Vertical
    doc.line(205, 51, 205, 65, "FD"); // Linea Vertical
    doc.line(4, 65, 205, 65, "FD"); // Linea Horizontal
    //CONTENIDO
    if (movementsOfArticles) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.line(4, 68, 205, 68, "FD"); // Linea Horizontal
        doc.line(4, 68, 4, 74, "FD"); // Linea Vertical
        doc.line(205, 68, 205, 74, "FD"); // Linea Vertical
        doc.line(4, 74, 205, 74, "FD"); // Linea Horizontal
        //colunas
        doc.line(15, 68, 15, 74, "FD"); // Linea Vertical
        doc.line(41, 68, 41, 74, "FD"); // Linea Vertical
        doc.line(127, 68, 127, 74, "FD"); // Linea Vertical
        doc.line(151, 68, 151, 74, "FD"); // Linea Vertical
        doc.line(171, 68, 171, 74, "FD"); // Linea Vertical
        doc.line(182, 68, 182, 74, "FD"); // Linea Vertical
        doc.text('Cant.', 6, 72);
        doc.text('Código', 17, 72);
        doc.text('Descripción', 42, 72);
        doc.text('Precio U.', 129, 72);
        doc.text('Desct.', 153, 72);
        doc.text('IVA', 173, 72);
        doc.text('Precio total', 184, 72);
    }
    else {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.line(4, 68, 205, 68, "FD"); // Linea Horizontal
        doc.line(4, 68, 4, 74, "FD"); // Linea Vertical
        doc.line(205, 68, 205, 74, "FD"); // Linea Vertical
        doc.line(4, 74, 205, 74, "FD"); // Linea Horizontal
        //colunas
        doc.line(71, 68, 71, 74, "FD"); // Linea Vertical
        doc.line(100, 68, 100, 74, "FD"); // Linea Vertical
        doc.line(130, 68, 130, 74, "FD"); // Linea Vertical
        doc.line(175, 68, 175, 74, "FD"); // Linea Vertical
        doc.text('Detalle', 6, 72);
        doc.text('Vencimiento', 73, 72);
        doc.text('Número', 102, 72);
        doc.text('Banco', 132, 72);
        doc.text('Total', 177, 72);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Razón Social:  ${config.companyName}`, 9, 38);
    doc.text(`Domicilio Comercial:   ${config.companyAddress}`, 9, 42);
    doc.text(`Condición de IVA:   ${((_a = config.companyVatCondition) === null || _a === void 0 ? void 0 : _a.description) || ""}`, 9, 46);
    doc.text(`Punto de Venta: ${(0, padString_1.padString)(transaction.origin, 4)}`, 120, 26);
    doc.text(`Comp. Nro: ${(0, padString_1.padString)(transaction.number, 10)}`, 165, 26);
    doc.text(`Fecha de Emición: ${(0, formateDate_1.formatDate)(transaction.startDate)} `, 120, 30);
    doc.text(`C.U.I.T: ${config.companyIdentificationValue}`, 120, 38);
    doc.text(`Ingresos Brutos: ${config.companyGrossIncome}`, 120, 42);
    doc.text(`Inicio de Actividades: ${(0, formateDate_1.formatDate)(config.companyStartOfActivity)}`, 120, 46);
    // Labels Segundo Cuadro
    doc.setFontSize(8.9);
    doc.text(`C.U.I.T: ${((_b = transaction.company) === null || _b === void 0 ? void 0 : _b.CUIT) || ""}`, 9, 57);
    doc.text(`Condición de IVA: ${((_c = transaction.VatCondition) === null || _c === void 0 ? void 0 : _c.description) || "Consumidor Final"}`, 9, 62);
    doc.text(`Razón Social: ${((_d = transaction.company) === null || _d === void 0 ? void 0 : _d.name) || ""}`, 87, 57);
    doc.text(`Domicilio Comercial:  ${((_e = transaction.company) === null || _e === void 0 ? void 0 : _e.address) || ""}`, 87, 62);
    doc.setFontSize(20);
    doc.text(transaction.letter, 104.5, 14);
    doc.text(transaction.type.name, 130, 16);
    doc.setFontSize(8);
    if (transaction.type.codes && config.country === 'AR') {
        for (let i = 0; i < transaction.type.codes.length; i++) {
            if (transaction.type.codes[i].code &&
                transaction.letter === transaction.type.codes[i].letter) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8);
                doc.text('Cod.' + (0, padString_1.padString)(transaction.type.codes[i].code.toString(), 2), 102.4, 18);
            }
        }
    }
}
async function footer(doc, transaction, qrDate, movementsOfCash, movementsOfArticles) {
    if (movementsOfCash && movementsOfArticles) {
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
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('Forma de pago', 10, 230);
        doc.text('Detalle', 45, 230);
        doc.text('Importe', 112, 230);
        doc.setFont("helvetica", "normal");
        let verticalPosition = 235;
        for (let i = 0; i < movementsOfCash.length; i++) {
            doc.text(movementsOfCash[i].type.name, 10, verticalPosition);
            doc.text(`$${(0, format_numbers_1.numberDecimal)(movementsOfCash[i].amountPaid)}`, 112, verticalPosition);
            movementsOfCash[i].observation.length > 0
                ? doc.text(`${movementsOfCash[i].observation.slice(0, 37)}-`, 44, verticalPosition)
                : '';
            if (movementsOfCash[i].observation.length > 35) {
                doc.text(`${movementsOfCash[i].observation.slice(37, 105)}-`, 44, (verticalPosition + 4)) || '';
                verticalPosition += 8;
            }
            else {
                verticalPosition += 4;
            }
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('Subtotal:', 138, 235);
        doc.text('Descuento:', 138, 241);
        doc.text('Neto Gravado:', 138, 247);
        if (transaction) {
            let texBase = 0;
            let percentage = 0;
            let verticalPosition = 254;
            for (let i = 0; i < transaction.taxes.length; i++) {
                texBase += transaction.taxes[i].taxBase;
                percentage += (1 + transaction.taxes[i].percentage / 100);
                doc.setFont("helvetica", "normal");
                doc.text(`$ ${transaction.taxes[i].taxAmount ? (0, format_numbers_1.numberDecimal)(transaction.taxes[i].taxAmount) : ''}`, 179, verticalPosition);
                doc.setFont("helvetica", "bold");
                doc.text(transaction.taxes[i].tax.name, 138, verticalPosition);
                verticalPosition += 7;
            }
            verticalPosition += 0, 5;
            doc.setFont("helvetica", "bold");
            doc.text('Total:', 138, verticalPosition);
            doc.setFont("helvetica", "normal");
            doc.text(`$ ${transaction.totalPrice ? (0, format_numbers_1.numberDecimal)(transaction.totalPrice) : ''} `, 179, verticalPosition);
            doc.text(`${transaction.totalPrice ? (0, format_numbers_1.numberDecimal)(transaction.totalPrice) : ''} `, 179, 235);
            doc.text(`$ ${texBase ? (0, format_numbers_1.numberDecimal)(texBase) : ''}`, 179, 247);
            doc.text(`${transaction.discountAmount / percentage > 0 ? `$ ${(0, format_numbers_1.transform)(transaction.discountAmount / percentage, 2)}` : ''}`, 179, 241);
        }
        if (transaction.CAE && transaction.CAEExpirationDate) {
            doc.addImage(qrDate, 'png', 9, 251, 35, 35);
            doc.setFont("helvetica", "bold");
            doc.text(`CAE N°: ${(transaction === null || transaction === void 0 ? void 0 : transaction.CAE) || ''}`, 45, 277);
            doc.text(transaction.CAEExpirationDate !== undefined ? `Fecha de Vto. CAE: ${(0, formateDate_1.formatDate)(transaction === null || transaction === void 0 ? void 0 : transaction.CAEExpirationDate)}` : 'Fecha de Vto. CAE:', 45, 282);
        }
    }
    else {
        doc.line(6, 250, 205, 250, "FD"); // Linea Horizontal
        doc.line(6, 250, 6, 290, "FD"); // Linea Vertical
        doc.line(205, 250, 205, 290, "FD"); // Linea Vertical
        doc.line(6, 290, 205, 290, "FD"); // Linea Horizontal
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('Total:', 138, 257);
        doc.setFont("helvetica", "normal");
        doc.text(`$ ${(0, format_numbers_1.numberDecimal)(transaction.totalPrice)} ` || '', 179, 257);
    }
    if (transaction.observation.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text('Observaciones:', 9, 272);
        doc.setFont("helvetica", "normal");
        let row = 272;
        transaction.observation.length > 0
            ? doc.text(transaction.observation.slice(0, 45) + '-', 37, row)
            : '';
        transaction.observation.length > 45
            ? doc.text(transaction.observation.slice(45, 105) + '-', 37, (row += 4))
            : '';
    }
}
async function getPrintTransaction(req, res) {
    var _a, _b;
    const transactionId = req.query.transactionId;
    const token = req.headers.authorization;
    try {
        const configs = await (0, config_services_1.getConfig)(token);
        const config = configs[0];
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        const transaction = await (0, transaction_services_1.getTransactionById)(transactionId, token);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const printers = await (0, printers_services_1.getPrinters)(token, "Mostrador");
        if (!printers) {
            return res.status(404).json({ message: "Printer not found" });
        }
        const qrDate = await (0, calculateQRAR_1.calculateQRAR)(transaction, config);
        const movementsOfArticles = await (0, movements_of_articles_services_1.getMovementsOfArticle)(transactionId, token);
        const movementsOfCashs = await (0, movements_of_cash_services_1.getMovementsOfCash)(token, transactionId);
        const pageWidth = printers.pageWidth;
        const pageHigh = printers.pageHigh;
        const units = "mm";
        const orientation = printers.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        if (config.companyPicture && config.companyPicture.length > 0) {
            const img = await (0, get_picture_services_1.getCompanyPictureFromGoogle)(config.companyPicture);
            doc.addImage(img, 'JPEG', 15, 8, 60, 26);
        }
        else {
            doc.text(config.companyPicture, 15, 16);
        }
        let verticalPosition = 79;
        let articlesPerPage = 37;
        let articlesOnCurrentPage = 0;
        let currentPage = 1;
        if (movementsOfArticles && movementsOfCashs) {
            for (let i = 0; i < movementsOfArticles.length; i++) {
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                const movementsOfArticle = movementsOfArticles[i];
                if (articlesOnCurrentPage >= articlesPerPage) {
                    header(doc, transaction, config, movementsOfArticles);
                    if (i !== movementsOfArticles.length - 1) {
                        doc.addPage();
                        currentPage++;
                        verticalPosition = 84;
                        articlesOnCurrentPage = 0;
                    }
                }
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(10);
                doc.text(movementsOfArticle.notes || "", 44, verticalPosition + 5);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.text(`${movementsOfArticle.amount}`, 6, verticalPosition);
                doc.text(movementsOfArticle.code, 17, verticalPosition);
                doc.text(movementsOfArticle.description, 42, verticalPosition);
                doc.text(`$ ${(0, format_numbers_1.numberDecimal)(movementsOfArticle.unitPrice)}`, 129, verticalPosition);
                doc.text(((_a = movementsOfArticle.taxes[0]) === null || _a === void 0 ? void 0 : _a.percentage) !== undefined ? `${(_b = movementsOfArticle.taxes[0]) === null || _b === void 0 ? void 0 : _b.percentage}%` : "", 173, verticalPosition);
                doc.text(`${movementsOfArticle.discountRate}%`, 153, verticalPosition);
                doc.text(`$ ${(0, format_numbers_1.numberDecimal)(movementsOfArticle.salePrice)}`, 184, verticalPosition);
                if (movementsOfArticle.notes) {
                    verticalPosition += 9;
                    articlesOnCurrentPage++;
                }
                else {
                    verticalPosition += 6;
                    articlesOnCurrentPage++;
                }
            }
            header(doc, transaction, config, movementsOfArticles);
            footer(doc, transaction, qrDate, movementsOfCashs, movementsOfArticles);
        }
        else if (movementsOfCashs && movementsOfCashs.length > 0) {
            for (let i = 0; i < movementsOfCashs.length; i++) {
                const movementsOfCash = movementsOfCashs[i];
                if (articlesOnCurrentPage >= articlesPerPage) {
                    header(doc, transaction, config, movementsOfArticles);
                    if (i !== movementsOfCashs.length - 1) {
                        doc.addPage();
                        currentPage++;
                        verticalPosition = 84;
                        articlesOnCurrentPage = 0;
                    }
                }
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7);
                doc.text(movementsOfCash.observation || "", 8, verticalPosition + 5);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(`${movementsOfCash.type.name}`, 6, verticalPosition);
                doc.text((0, formateDate_1.formatDate)(movementsOfCash.expirationDate), 73, verticalPosition);
                doc.text(movementsOfCash.number || '-', 102, verticalPosition);
                doc.text(movementsOfCash.bank ? movementsOfCash.bank.name : '-', 132, verticalPosition);
                doc.text(`$ ${movementsOfCash.amountPaid}`, 177, verticalPosition);
                if (movementsOfCash.observation) {
                    verticalPosition += 9;
                    articlesOnCurrentPage++;
                }
                else {
                    verticalPosition += 6;
                    articlesOnCurrentPage++;
                }
            }
            header(doc, transaction, config, movementsOfArticles);
            footer(doc, transaction, qrDate, movementsOfCashs, movementsOfArticles);
        }
        doc.autoPrint();
        doc.save(`transaction-${transactionId}.pdf`);
        const pdfPath = `transaction-${transactionId}.pdf`;
        if (fs.existsSync(pdfPath)) {
            res.contentType("application/pdf");
            res.setHeader('Content-Disposition', `inline; filename=./transaction-${transactionId}.pdf`);
            const fileStream = fs.createReadStream(pdfPath);
            fileStream.pipe(res);
            fileStream.on('end', () => {
                fs.unlink(pdfPath, (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo ${pdfPath}: ${err}`);
                    }
                    else {
                        console.log(`Archivo ${pdfPath} eliminado con éxito.`);
                    }
                });
            });
        }
        else {
            res.status(404).send('PDF no encontrado');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error });
    }
}
exports.getPrintTransaction = getPrintTransaction;
//# sourceMappingURL=get-print-transaction.js.map