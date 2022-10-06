import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compareFieldsValidation'

const makeSUT = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompare')
}
describe('CompareFieldValidation', () => {
  it('Should return a InvalidParamError error if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should not return error if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(error).toEqual(undefined)
  })
})
