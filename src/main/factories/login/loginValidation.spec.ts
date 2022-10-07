import { EmailValidation } from '../../../presentation/helper/validators/emailValidation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validationComposite'
import { EmailValidator } from '../../../presentation/protocols/emailValidator'
import { makeLoginValidation } from './loginValidation'

jest.mock('../../../presentation/helper/validators/validationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('Should  call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
