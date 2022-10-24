"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBAddAccount = void 0;
class DBAddAccount {
    constructor(hasher, addAccountRepository) {
        this.hasher = hasher;
        this.addAccountRepository = addAccountRepository;
    }
    async add(account) {
        const hashedPassword = await this.hasher.hash(account.password);
        const accountData = await this.addAccountRepository.add({ ...account, password: hashedPassword });
        return accountData;
    }
}
exports.DBAddAccount = DBAddAccount;
