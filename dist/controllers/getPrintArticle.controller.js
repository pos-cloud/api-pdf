"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintArticle = void 0;
const article_services_1 = require("../services/article.services");
const printers_services_1 = require("../services/printers.services");
const getBarcode_1 = require("../utils/getBarcode");
const getPicture_service_1 = require("../services/getPicture.service");
const config_services_1 = require("../services/config.services");
const { jsPDF } = require("jspdf");
const fs = require('fs');
async function getPrintArticle(req, res) {
    const token = req.headers.authorization;
    const articleId = req.query.articleId;
    const quantity = req.query.quantity;
    try {
        const configs = await (0, config_services_1.getConfig)(token);
        const config = configs[0];
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        if (!quantity) {
            return res.status(404).json({ message: "no quantity found" });
        }
        const article = await (0, article_services_1.getArticleData)(articleId, token);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        const printer = await (0, printers_services_1.getPrinters)(token, "Etiqueta");
        if (!printer) {
            return res.status(404).json({ message: "Printer not found" });
        }
        const pageWidth = printer.pageWidth;
        const pageHigh = printer.pageHigh;
        const units = 'mm';
        const orientation = printer.orientation;
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        if (quantity && parseInt(quantity) >= 1) {
            for (let index = 0; index < parseInt(quantity); index++) {
                if (index > 0) {
                    console.log(index);
                    doc.addPage();
                }
                for (const field of printer.fields) {
                    switch (field.type) {
                        case 'label':
                            if (field.font !== 'default') {
                                doc.setFont(field.font, field.fontType);
                            }
                            doc.setFontSize(field.fontSize);
                            doc.text(field.positionStartX, field.positionStartY, field.value);
                            break;
                        case 'line':
                            doc.setLineWidth(field.fontSize);
                            doc.line(field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
                            break;
                        case 'image':
                            try {
                                //const img = await getCompanyPictureData(eval(field.value), token);
                                const img = await (0, getPicture_service_1.getCompanyPictureFromGoogle)(eval(field.value));
                                doc.addImage(img, 'png', field.positionStartX, field.positionStartY, field.positionEndX, field.positionEndY);
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
                        case 'dataEsp':
                            if (field.font !== 'default') {
                                doc.setFont(field.font, field.fontType);
                            }
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
            }
        }
        doc.autoPrint();
        doc.save(`article-${articleId}.pdf`);
        const pdfPath = `article-${articleId}.pdf`;
        if (fs.existsSync(pdfPath)) {
            res.contentType("application/pdf");
            res.setHeader('Content-Disposition', `inline; filename=./article-${articleId}.pdf`);
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
exports.getPrintArticle = getPrintArticle;
//# sourceMappingURL=getPrintArticle.controller.js.map