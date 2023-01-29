"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const he_1 = __importDefault(require("he"));
function unescapeString(inputString) {
    return he_1.default.decode(he_1.default.decode(inputString));
}
exports.default = unescapeString;
