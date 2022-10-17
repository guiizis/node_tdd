import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwtAdapter"

jest.mock('jsonwebtoken', () => ({
  sign: (): Promise<string> => new Promise(resolve => resolve('any_token'))
}))


describe('jwt adapter tests', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('should return a token on a sign success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  it('should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret')
    
    jest.spyOn(jwt, 'sign').mockImplementationOnce(()=>{
      throw new Error('')
    })
    
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})