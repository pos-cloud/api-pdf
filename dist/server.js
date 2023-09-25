"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("./app");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
new app_1.default(app);
app.listen(process.env.PORT, () => {
    console.info(`Server running on: ${process.env.PORT}`);
})
    .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    }
    else {
        console.log(err);
    }
});
//# sourceMappingURL=server.js.map