"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
class Routes {
    constructor(app) {
        app.use('/', routes_1.default);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map