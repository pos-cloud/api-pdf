"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintArticle = void 0;
const article_services_1 = require("../services/article.services");
const printers_services_1 = require("../services/printers.services");
const getBarcode_1 = require("../utils/getBarcode");
const getPicture_service_1 = require("../services/getPicture.service");
const config_services_1 = require("../services/config.services");
const sharp = require('sharp');
const { jsPDF } = require("jspdf");
async function getPrintArticle(req, res) {
    const database = req.database;
    const articleId = req.query.articleId;
    const token = req.headers.authorization;
    try {
        const configs = await (0, config_services_1.getConfig)(token);
        const config = configs[0];
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        const article = await (0, article_services_1.getArticleData)(articleId, token);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        const printers = await (0, printers_services_1.getPrinters)(token, "Etiqueta");
        if (!printers) {
            return res.status(404).json({ message: "Printer not found" });
        }
        const pageWidth = printers.pageWidth;
        const pageHigh = printers.pageHigh;
        const units = 'mm';
        const orientation = printers.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        for (const field of printers.fields) {
            switch (field.type) {
                case 'label':
                    if (field.font !== 'default') {
                        doc.setFont(field.font);
                    }
                    doc.setFont('', field.fontType);
                    doc.setFontSize(field.fontSize);
                    doc.text(field.positionStartX, field.positionStartY, field.value);
                    break;
                case 'line':
                    doc.setLineWidth(field.fontSize);
                    doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                    break;
                case 'image':
                    try {
                        const img = await (0, getPicture_service_1.getCompanyPictureData)(eval(field.value), token);
                        // Decodificar la cadena de datos en un búfer de imagen
                        const imageBuffer = Buffer.from(img, 'base64');
                        // Reducir la calidad de la imagen antes de agregarla al PDF
                        const optimizedImageBuffer = await sharp(imageBuffer).jpeg({ quality: 70 }).toBuffer();
                        doc.addImage(optimizedImageBuffer, 'JPEG', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case 'barcode':
                    try {
                        const response = await (0, getBarcode_1.getBarcode)('code128', eval(field.value));
                        doc.addImage(response, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case 'data':
                    if (field.font !== 'default') {
                        doc.setFont(field.font);
                    }
                    doc.setFont('', field.fontType);
                    doc.setFontSize(field.fontSize);
                    try {
                        const text = field.positionEndX || field.positionEndY
                            ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
                            : eval(field.value).toString();
                        doc.text(field.positionStartX, field.positionStartY, text);
                    }
                    catch (e) {
                        doc.text(field.positionStartX, field.positionStartY, " ");
                    }
                    break;
                case 'dataEsp':
                    if (field.font !== 'default') {
                        doc.setFont(field.font);
                    }
                    doc.setFont('', field.fontType);
                    doc.setFontSize(field.fontSize);
                    try {
                        const text = field.positionEndX || field.positionEndY
                            ? eval(field.value).toString().slice(field.positionEndX, field.positionEndY)
                            : eval(field.value).toString();
                        doc.text(field.positionStartX, field.positionStartY, text);
                    }
                    catch (e) {
                        doc.text(field.positionStartX, field.positionStartY, " ");
                    }
                    break;
                default:
                    break;
            }
        }
        doc.autoPrint();
        doc.save('article.pdf');
        const pdfBase64 = doc.output("datauristring");
        return res.status(200).send({ pdfBase64 });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error });
    }
}
exports.getPrintArticle = getPrintArticle;
//# sourceMappingURL=getPrintArticle.controller.js.map