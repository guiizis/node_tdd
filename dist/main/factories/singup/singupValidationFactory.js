"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSingUpValidation = void 0;
const validators_1 = require("../../../presentation/helper/validators");
const emailValidatorAdapter_1 = require("../../adapters/validators/emailValidatorAdapter");
const makeSingUpValidation = () => {
    const validations = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new validators_1.RequiredFieldValidation(field));
    }
    validations.push(new validators_1.CompareFieldValidation('password', 'passwordConfirmation'));
    validations.push(new validators_1.EmailValidation(new emailValidatorAdapter_1.EmailValidatorAdapter(), 'email'));
    return new validators_1.ValidationComposite(validations);
};
exports.makeSingUpValidation = makeSingUpValidation;
