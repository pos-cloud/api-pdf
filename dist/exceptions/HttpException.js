"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/node");
const moment = require("moment");
require("moment/locale/es");
class HttpException extends Error {
    constructor(responser) {
        let message = responser.message && responser.message.toString() !== ''
            ? responser.message.toString()
            : 'Error inesperado.';
        super(message);
        this.status = responser.status;
        this.result = responser.result;
        this.message = message;
        this.error = responser.error ? responser.error.toString() : 'Error inesperado.';
        if (this.status === 500) {
            try {
                Sentry.captureException(this.error);
            }
            catch (error) {
                console.log(error);
            }
            console.error('\x1b[32m', moment().format('DD/MM/YYYY HH:mm:ss'), `STATUS ${this.status}`);
            console.error(this.status === 500 ? '\x1b[31m' : '\x1b[33m', this.stack ? this.stack : 'Error inesperado.');
            console.log('\x1b[37m', '\x1b[40m');
        }
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map