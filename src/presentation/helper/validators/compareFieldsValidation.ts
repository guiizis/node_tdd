import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompare) { }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
