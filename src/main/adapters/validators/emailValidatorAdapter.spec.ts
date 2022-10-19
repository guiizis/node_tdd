import { EmailValidatorAdapter } from './emailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSUT = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('emailAdapter tests', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSUT()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = makeSUT()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const spyEmail = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')

    expect(spyEmail).toBeCalledWith('valid_email@mail.com')
  })
})
