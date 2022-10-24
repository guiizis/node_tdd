"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
exports.default = (app) => {
    app.use(middlewares_1.bodyParser, middlewares_1.cors, middlewares_1.contentType);
};
