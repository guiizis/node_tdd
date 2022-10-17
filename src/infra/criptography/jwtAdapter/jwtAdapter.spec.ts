import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwtAdapter"

describe('jwt adapter tests', () => {
  it('should call sign with correct values', async() => { 
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({id: 'any_id'}, 'secret')
  })
})