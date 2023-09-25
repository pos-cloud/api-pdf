"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jwt-simple");
async function authMiddleware(request, response, next) {
    var _a;
    if ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) {
        const token = request.headers.authorization.replace(/['"]+/g, '');
        try {
            const dataJWT = jwt.decode(token, process.env.TOKEN_SECRET || '');
            const database = dataJWT === null || dataJWT === void 0 ? void 0 : dataJWT.database;
            const userId = dataJWT === null || dataJWT === void 0 ? void 0 : dataJWT.user;
            request.database = database;
            request.userId = userId;
            next();
        }
        catch (error) {
            response.status(500).send({ message: error.toString() });
        }
    }
    else {
        response.status(500).send({ message: 'No se encontro authorization' });
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map