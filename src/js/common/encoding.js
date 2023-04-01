"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMovement = exports.encodeMovement = exports.decodeVelocity = exports.encodeVelocity = exports.decodePosition = exports.encodePosition = exports.decodeId = exports.encodeId = void 0;
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
