"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const httpHelpers_1 = require("../../helper/http/httpHelpers");
class LoginController {
    constructor(validation, authenticator) {
        this.validation = validation;
        this.authenticator = authenticator;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, httpHelpers_1.badRequest)(error);
            }
            const { email, password } = httpRequest.body;
            const accessToken = await this.authenticator.auth({ email, password });
            if (!accessToken) {
                return (0, httpHelpers_1.unauthorized)();
            }
            return (0, httpHelpers_1.ok)({ accessToken });
        }
        catch (error) {
            return (0, httpHelpers_1.serverError)(error);
        }
    }
}
exports.LoginController = LoginController;
