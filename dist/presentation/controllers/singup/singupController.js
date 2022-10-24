"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupController = void 0;
const httpHelpers_1 = require("../../helper/http/httpHelpers");
class SignupController {
    constructor(addAccount, validation) {
        this.addAccount = addAccount;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, httpHelpers_1.badRequest)(error);
            }
            const { name, email, password } = httpRequest.body;
            const account = await this.addAccount.add({
                name,
                email,
                password
            });
            return (0, httpHelpers_1.ok)(account);
        }
        catch (error) {
            console.error(error);
            return (0, httpHelpers_1.serverError)(error);
        }
    }
}
exports.SignupController = SignupController;
