"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintTransaction = void 0;
const transaction_service_1 = require("../services/transaction.service");
const printers_services_1 = require("../services/printers.services");
const config_services_1 = require("../services/config.services");
const { jsPDF } = require("jspdf");
const formateDate_1 = require("../utils/formateDate");
const padString_1 = require("./../utils/padString");
const getPicture_service_1 = require("./../services/getPicture.service");
const calculateQRAR_1 = require("../utils/calculateQRAR");
const sharp = require('sharp');
const header = async (doc, transaction, config, token, imgLogo) => {
    var _a, _b, _c, _d, _e;
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
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.line(6, 72, 205, 72, "FD"); // Linea Horizontal
    doc.line(6, 72, 6, 78, "FD"); // Linea Vertical
    doc.line(205, 72, 205, 78, "FD"); // Linea Vertical
    doc.line(6, 78, 205, 78, "FD"); // Linea Horizontal
    //colunas
    doc.line(38, 72, 38, 78, "FD"); // Linea Vertical
    doc.line(106, 72, 106, 78, "FD"); // Linea Vertical
    doc.line(145, 72, 145, 78, "FD"); // Linea Vertical
    doc.line(170, 72, 170, 78, "FD"); // Linea Vertical
    doc.text('Código', 9, 76);
    doc.text('Descripción', 41, 76);
    doc.text('Precio unitario', 109, 76);
    doc.text('IVA', 148, 76);
    doc.text('Precio total', 173, 76);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Razón Social:  ${config.companyName}`, 9, 28);
    doc.text(`Domicilio Comercial:   ${config.companyAddress}`, 9, 35);
    doc.text(`Condición de IVA:   ${((_a = config.companyVatCondition) === null || _a === void 0 ? void 0 : _a.description) || ""}`, 9, 42);
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
    doc.text(`Condición de venta:`, 9, 67);
    doc.text(`Apellido y Nombre / Razón Social: ${((_d = transaction.company) === null || _d === void 0 ? void 0 : _d.name) || ""}`, 100, 57);
    doc.text(`Domicilio Comercial:  ${((_e = transaction.company) === null || _e === void 0 ? void 0 : _e.address) || ""}`, 100, 62);
    doc.setFontSize(20);
    doc.text(transaction.letter, 104.5, 14);
    doc.text(transaction.type.name, 130, 16);
    if (typeof imgLogo !== "undefined") {
        doc.addImage(imgLogo, 'JPEG', 15, 8, 45, 16);
    }
    else {
        doc.text(config.companyName, 15, 16);
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    if (transaction.type.codes && config.country === 'AR') {
        for (let i = 0; i < transaction.type.codes.length; i++) {
            if (transaction.type.codes[i].code &&
                transaction.letter === transaction.type.codes[i].letter) {
                doc.setFontSize('8');
                doc.text('Cod:' + (0, padString_1.padString)(transaction.type.codes[i].code.toString(), 2), 101.4, 18);
            }
        }
    }
};
async function footer(doc, transaction, qrDate) {
    doc.line(6, 180, 205, 180, "FD"); // Linea Horizontal
    doc.line(6, 180, 6, 250, "FD"); // Linea Vertical
    doc.line(205, 180, 205, 250, "FD"); // Linea Vertical
    doc.line(6, 250, 205, 250, "FD"); // Linea Horizontal
    doc.addImage(qrDate, 'png', 10, 249, 43, 43);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`CAE N°: ${(transaction === null || transaction === void 0 ? void 0 : transaction.CAE) || ''}`, 155, 260);
    doc.text(transaction.CAEExpirationDate !== undefined ? `Fecha de Vto. CAE: ${(0, formateDate_1.formatDate)(transaction === null || transaction === void 0 ? void 0 : transaction.CAEExpirationDate)}` : 'Fecha de Vto. CAE:', 126, 266);
}
async function getPrintTransaction(req, res) {
    const transactionId = req.query.transactionId;
    const token = req.headers.authorization;
    try {
        const configs = await (0, config_services_1.getConfig)(token);
        const config = configs[0];
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        const transaction = await (0, transaction_service_1.getTransactionById)(transactionId, token);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const printers = await (0, printers_services_1.getPrinters)(token, "Mostrador");
        if (!printers) {
            return res.status(404).json({ message: "Printer not found" });
        }
        const qrDate = await (0, calculateQRAR_1.calculateQRAR)(transaction, config);
        //const movements = await getMovementsOfArticle(transactionId, token)
        const pageWidth = printers.pageWidth;
        const pageHigh = printers.pageHigh;
        const units = "mm";
        const orientation = printers.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        // if (config.companyPicture !== 'default.jpg') {
        const imgLogo = await (0, getPicture_service_1.getCompanyPictureData)(config.companyPicture, token);
        const imageBuffer = Buffer.from(imgLogo, 'base64');
        const optimizedImageBuffer = await sharp(imageBuffer).jpeg({ quality: 70 }).toBuffer();
        // } else {
        //   doc.text(config.companyName, 15, 16);
        // }
        footer(doc, transaction, qrDate);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        // if (movements) {
        //   let verticalPosition = 84;
        //   for (let i = 0; i < movements.length; i++) {
        //     const movimiento = movements[i];
        //     doc.text(movimiento.code, 9, verticalPosition);
        //     doc.text(movimiento.description, 41, verticalPosition)
        //     doc.text(`$${movimiento.unitPrice.toFixed(2).replace('.', ',')}`, 109, verticalPosition)
        //     doc.text(movimiento.taxes[0]?.percentage !== undefined ? `${movimiento.taxes[0]?.percentage}%` : "", 148, verticalPosition)
        //     doc.text(`$${movimiento.salePrice.toFixed(2).replace('.', ',')}`, 173, verticalPosition)
        //     verticalPosition += 6;
        //   }
        // }
        header(doc, transaction, config, token, optimizedImageBuffer);
        doc.autoPrint();
        doc.save('factu.pdf');
        const pdfBase64 = doc.output("datauristring");
        return res.status(200).send({ pdfBase64 });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getPrintTransaction = getPrintTransaction;
//# sourceMappingURL=getPrintTransaction.js.map