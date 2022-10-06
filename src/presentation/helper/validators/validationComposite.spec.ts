import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validationComposite'

interface sutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    validationStub,
    sut
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'ay_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
