"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("../exceptions/HttpException");
const responser_1 = require("../utils/responser");
class WrongTokenException extends HttpException_1.default {
    constructor() {
        let responser = new responser_1.default();
        responser.result = null;
        responser.error = 'wrong token';
        responser.status = 401;
        responser.message = 'wrong token';
        super(responser);
    }
}
exports.default = WrongTokenException;
//# sourceMappingURL=WrongTokenException.js.map