import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiredFieldValidation'

const makeSUT = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('RequiredFieldValidation', () => {
  it('Should return a Missing Param error if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should not return error if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(undefined)
  })
})
