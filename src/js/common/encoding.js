"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeText = exports.encodeText = exports.MAX_TEXT_SIZE = exports.decodeMovement = exports.encodeMovement = exports.decodeVelocity = exports.encodeVelocity = exports.decodePosition = exports.encodePosition = exports.decodeId = exports.encodeId = void 0;
function encodeId(id) {
    return [id & 0xff, id >> 8 & 0xff];
}
exports.encodeId = encodeId;
function decodeId(a, b) {
    return a | b << 8;
}
exports.decodeId = decodeId;
function encodePosition(x, y, r) {
    const a = x & 0xff;
    const b = (x >> 8 & 0xf) | (y & 0xf) << 4;
    const c = (y >> 4 & 0x7f) | (r ? 1 : 0) << 7;
    return [a, b, c];
}
exports.encodePosition = encodePosition;
function decodePosition(a, b, c) {
    const x = a | (b & 0xf) << 8;
    const y = b >> 4 | (c & 0x7f) << 4;
    const right = !!(c & 0x80);
    return { x, y, right };
}
exports.decodePosition = decodePosition;
function encodeVelocity(vx, vy) {
    return (vx + 1) | (vy + 1) << 2;
}
exports.encodeVelocity = encodeVelocity;
function decodeVelocity(a) {
    const vx = (a & 0b11) - 1;
    const vy = ((a >> 2) & 0b11) - 1;
    return { vx, vy };
}
exports.decodeVelocity = decodeVelocity;
function encodeMovement(id, x, y, right, vx, vy) {
    const ab = encodeId(id);
    const cde = encodePosition(x, y, right);
    const f = encodeVelocity(vx, vy);
    return [...ab, ...cde, f];
}
exports.encodeMovement = encodeMovement;
function decodeMovement(a, b, c, d, e, f) {
    const id = decodeId(a, b);
    const xyr = decodePosition(c, d, e);
    const v = decodeVelocity(f);
    return { id, ...xyr, ...v };
}
exports.decodeMovement = decodeMovement;
exports.MAX_TEXT_SIZE = 0xf;
function encodeText(text) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(text);
    if (buffer.length > exports.MAX_TEXT_SIZE) {
        console.warn(`Max text size reached: ${buffer.length}/${exports.MAX_TEXT_SIZE}`);
        return buffer.slice(0, exports.MAX_TEXT_SIZE - 1);
    }
    return buffer;
}
exports.encodeText = encodeText;
function decodeText(data, offset = 0) {
    const decoder = new TextDecoder();
    const length = data[offset++];
    return decoder.decode(data.slice(offset, offset + length));
}
exports.decodeText = decodeText;
