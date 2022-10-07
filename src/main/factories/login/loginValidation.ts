import { EmailValidation } from '../../../presentation/helper/validators/emailValidation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validationComposite'
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
