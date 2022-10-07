import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validationComposite'

interface sutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): sutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    validationStubs,
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
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'ay_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'ay_value' })
    expect(error).toEqual(new Error())
  })

  it('Should not return error if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'ay_value' })
    expect(error).toBeFalsy()
  })
})
