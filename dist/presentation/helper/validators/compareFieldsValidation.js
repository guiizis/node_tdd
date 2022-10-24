"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFieldValidation = void 0;
const errors_1 = require("../../errors");
class CompareFieldValidation {
    constructor(fieldName, fieldToCompare) {
        this.fieldName = fieldName;
        this.fieldToCompare = fieldToCompare;
    }
    validate(input) {
        if (input[this.fieldName] !== input[this.fieldToCompare]) {
            return new errors_1.InvalidParamError(this.fieldToCompare);
        }
    }
}
exports.CompareFieldValidation = CompareFieldValidation;
