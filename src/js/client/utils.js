"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
function sample(array) {
    if (!array.length) {
        throw new Error('No items in array');
    }
    const length = array.length;
    const index = Math.floor(Math.random() * length);
    return array[index];
}
exports.sample = sample;
