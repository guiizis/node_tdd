"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMongoRepository = void 0;
const mongodb_1 = require("mongodb");
const mongoHelper_1 = require("../helpers/mongoHelper");
class AccountMongoRepository {
    async add(accountData) {
        const accountCollection = await mongoHelper_1.MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const id = result.insertedId;
        return mongoHelper_1.MongoHelper.map({ ...accountData, id });
    }
    async loadByEmail(email) {
        const accountCollection = await mongoHelper_1.MongoHelper.getCollection('accounts');
        const accountData = await accountCollection.findOne({ email });
        return accountData && mongoHelper_1.MongoHelper.map(accountData);
    }
    async updateAccessToken(id, token) {
        const accountCollection = await mongoHelper_1.MongoHelper.getCollection('accounts');
        await accountCollection.updateOne({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                accessToken: token
            }
        });
    }
}
exports.AccountMongoRepository = AccountMongoRepository;
