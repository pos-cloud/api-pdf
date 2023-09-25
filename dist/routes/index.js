"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const print_routes_1 = require("./print.routes");
class Routes {
    constructor(app) {
        app.use('/', print_routes_1.default);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map