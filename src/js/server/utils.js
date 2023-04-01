"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathTo = void 0;
const path_1 = __importDefault(require("path"));
function pathTo(...relativePath) {
    return path_1.default.join(__dirname, '..', '..', '..', ...relativePath);
}
exports.pathTo = pathTo;
