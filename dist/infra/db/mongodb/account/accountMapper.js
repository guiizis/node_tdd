"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const map = (account) => {
    const { _id, ...accountWithouID } = account;
    return Object.assign({}, accountWithouID);
};
exports.map = map;
