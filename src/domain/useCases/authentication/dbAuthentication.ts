import { HashComparer } from '../../../data/protocols/cryptography/hashComparer'
import { TokenGenerator } from '../../../data/protocols/cryptography/tokenGenerator'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/loadAccountByEmailRepository'
import { Authentication, AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly hashComparer: HashComparer, private readonly tokenGenerator: TokenGenerator) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
