"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressRoutesAdapter_1 = require("../adapters/express/expressRoutesAdapter");
const loginFactory_1 = require("../factories/login/loginFactory");
const singupFactory_1 = require("../factories/singup/singupFactory");
exports.default = (router) => {
    router.post('/singup', (0, expressRoutesAdapter_1.adaptRoute)((0, singupFactory_1.makeSingUpController)()));
    router.post('/login', (0, expressRoutesAdapter_1.adaptRoute)((0, loginFactory_1.makeLoginController)()));
};
