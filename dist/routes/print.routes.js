"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const getPrintArticle_controller_1 = require("../controllers/getPrintArticle.controller");
const getPrintTransaction_1 = require("../controllers/getPrintTransaction");
const get_image_controller_1 = require("../controllers/get-image.controller");
class PrintRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get('/article', [auth_middleware_1.default], getPrintArticle_controller_1.getPrintArticle);
        this.router.get('/transaction', [auth_middleware_1.default], getPrintTransaction_1.getPrintTransaction);
        this.router.get('/get-img', [auth_middleware_1.default], get_image_controller_1.getImage);
    }
}
exports.default = new PrintRoutes().router;
//# sourceMappingURL=print.routes.js.map