/* eslint-disable @typescript-eslint/return-await */
import { EmailValidation } from './emailValidation'
import { EmailValidator } from '../../protocols/emailValidator'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSUT = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any_email@test.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@test.com')
  })

  it('Should throw if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      return null
    })

    sut.validate({ email: 'any_email@test.com' })
    expect(sut.validate).toThrow()
  })
})
