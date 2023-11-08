"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const get_print_article_controller_1 = require("../controllers/get-print-article.controller");
const get_print_transaction_1 = require("../controllers/get-print-transaction");
const get_image_controller_1 = require("../controllers/get-image.controller");
const get_print_articles_controller_1 = require("../controllers/get-print-articles.controller");
class PrintRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get('/article', [auth_middleware_1.default], get_print_article_controller_1.getPrintArticle);
        this.router.get('/transaction', [auth_middleware_1.default], get_print_transaction_1.getPrintTransaction);
        this.router.get('/get-img', [auth_middleware_1.default], get_image_controller_1.getImage);
        this.router.post('/get-articles', [auth_middleware_1.default], get_print_articles_controller_1.getPrintArticles);
    }
}
exports.default = new PrintRoutes().router;
//# sourceMappingURL=routes.js.map