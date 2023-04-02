"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.clamp = void 0;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
async function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}
exports.delay = delay;
