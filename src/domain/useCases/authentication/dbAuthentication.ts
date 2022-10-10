import { HashComparer } from '../../../data/protocols/cryptography/hashComparer'
import { TokenGenerator } from '../../../data/protocols/cryptography/tokenGenerator'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/loadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/UpdateAccessTokenRepository'
import { Authentication, AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
