"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Responser {
    constructor(status, result = null, message, error = null) {
        this.status = status;
        this.result = result;
        this.message = message
            ? message
            : status === 200
                ? 'Operación realizada con éxito.'
                : '';
        this.error = error;
    }
}
exports.default = Responser;
//# sourceMappingURL=responser.js.map