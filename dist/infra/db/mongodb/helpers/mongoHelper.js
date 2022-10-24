"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoHelper = void 0;
const mongodb_1 = require("mongodb");
exports.MongoHelper = {
    client: null,
    uri: null,
    async connect(uri) {
        this.uri = uri;
        this.client = await mongodb_1.MongoClient.connect(uri);
    },
    async disconnect() {
        await this.client.close();
        this.client = null;
    },
    async getCollection(name) {
        if (!this.client) {
            await this.connect(this.uri);
        }
        return this.client.db().collection(name);
    },
    map: (data) => {
        const { _id, ...rest } = data;
        return { ...rest, id: _id.toHexString() };
    },
};
