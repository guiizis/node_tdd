import { RequiredFieldValidation } from '../../presentation/helper/validators/requiredFieldValidation'
import { Validation } from '../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../presentation/helper/validators/validationComposite'
import { makeSingUpValidation } from './singupValidation'

jest.mock('../../presentation/helper/validators/validationComposite')

describe('SingupValidation Factory', () => {
  it('Should  call ValidationComposite with all validations', () => {
    makeSingUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
