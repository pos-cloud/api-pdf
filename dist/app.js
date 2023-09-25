"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const morgan = require('morgan');
const index_1 = require("./routes/index");
const cors = require('cors');
class App {
    constructor(app) {
        this.config(app);
        new index_1.default(app);
    }
    config(app) {
        app.use((0, express_1.json)());
        // const accessLogStream: WriteStream = fs.createWriteStream(
        //   path.join(__dirname, './logs/access.log'),
        //   { flags: 'a' }
        // );
        app.use(morgan('dev'));
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.use(cors());
        //app.use(helmet());
        //app.use(rateLimiter()); //  apply to all requests
        ///app.use(unCoughtErrorHandler);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map