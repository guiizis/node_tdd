import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validationComposite'

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'ay_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})