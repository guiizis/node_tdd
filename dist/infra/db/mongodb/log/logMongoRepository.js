"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMongoRepository = void 0;
const mongoHelper_1 = require("../helpers/mongoHelper");
class LogMongoRepository {
    async logError(stack) {
        const errorCollection = await mongoHelper_1.MongoHelper.getCollection('errors');
        await errorCollection.insertOne({
            stack,
            date: new Date()
        });
    }
}
exports.LogMongoRepository = LogMongoRepository;
