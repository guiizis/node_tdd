import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiredFieldValidation'

describe('RequiredFieldValidation', () => {
  it('Should return a Missing Param error if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
