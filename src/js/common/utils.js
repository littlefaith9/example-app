"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.delay = exports.clamp = void 0;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
async function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}
exports.delay = delay;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
exports.randomString = randomString;
