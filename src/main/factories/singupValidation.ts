import { CompareFieldValidation } from '../../presentation/helper/validators/compareFieldsValidation'
import { RequiredFieldValidation } from '../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../presentation/helper/validators/validationComposite'

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
