"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintArticles = void 0;
const config_services_1 = require("../services/config.services");
const article_services_1 = require("../services/article.services");
const format_numbers_1 = require("../utils/format-numbers");
const make_services_1 = require("../services/make.services");
const { jsPDF } = require("jspdf");
const fs = require('fs');
async function getPrintArticles(req, res) {
    const token = req.headers.authorization;
    const database = req.database;
    try {
        const id = req.body;
        if (!id) {
            return res.status(404).json({ message: "id not found" });
        }
        const configs = await (0, config_services_1.getConfig)(token);
        const config = configs[0];
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        const articles = await (0, article_services_1.getArticlesData)(id, database);
        if (!articles) {
            return res.status(404).json({ message: "Articles not found" });
        }
        const pageWidth = 210;
        const pageHigh = 297;
        const units = 'mm';
        const orientation = 'p';
        const doc = new jsPDF(orientation, units, [pageWidth, pageHigh]);
        let x = 15;
        let y = 10;
        //set counter
        let count = 1;
        //set date
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
        for (let articleItem of articles) {
            doc.rect(x, y, 60, 30.5);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(30);
            doc.text(x + 5, y + 12, `$${(0, format_numbers_1.transform)(articleItem.salePrice)}`);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            articleItem.description.length > 0
                ? doc.text(articleItem.description.slice(0, 30) + '-', x + 1, y + 20)
                : '';
            articleItem.description.length > 30
                ? doc.text(articleItem.description.slice(30, 58) + '-', x + 1, (y + 23))
                : '';
            articleItem.description.length > 58
                ? articleItem.description.slice(58, 105)
                : '';
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(x + 1, y + 29, config.companyFantasyName);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text(x + 40, y + 29, datetime);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            const make = await (0, make_services_1.getmake)(articleItem.make, database);
            if (make) {
                doc.text(x + 1, y + 26, make.description || '');
            }
            //validate position
            if (x >= 110) {
                x = 15;
                y += 30.5;
            }
            else {
                x += 60;
            }
            if (count === 27) {
                doc.addPage();
                x = 15;
                y = 10;
                count = 1;
            }
            else {
                count++;
            }
        }
        doc.autoPrint();
        doc.save(`article-${database}.pdf`);
        const pdfPath = `article-${database}.pdf`;
        if (fs.existsSync(pdfPath)) {
            res.contentType("application/pdf");
            res.setHeader('Content-Disposition', `inline; filename=./article-f.pdf`);
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
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
}
exports.getPrintArticles = getPrintArticles;
//# sourceMappingURL=get-print-articles.controller.js.map