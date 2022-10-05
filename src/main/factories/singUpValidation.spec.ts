import { CompareFieldValidation } from '../../presentation/helper/validators/compareFieldsValidation'
import { EmailValidation } from '../../presentation/helper/validators/emailValidation'
import { RequiredFieldValidation } from '../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../presentation/helper/validators/validationComposite'
import { EmailValidator } from '../../presentation/protocols/emailValidator'
import { makeSingUpValidation } from './singupValidation'

jest.mock('../../presentation/helper/validators/validationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SingupValidation Factory', () => {
  it('Should  call ValidationComposite with all validations', () => {
    makeSingUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
