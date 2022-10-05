import { CompareFieldValidation } from '../../presentation/helper/validators/compareFieldsValidation'
import { EmailValidation } from '../../presentation/helper/validators/emailValidation'
import { RequiredFieldValidation } from '../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../presentation/helper/validators/validationComposite'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))

  return new ValidationComposite(validations)
}
