"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnv = void 0;
exports.processEnv = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT || 'tjyjJIFJE=='
};
