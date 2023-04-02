export function encodeId(id: number) {
	return [id & 0xff, id >> 8 & 0xff];
}

export function decodeId(a: number, b: number) {
	return a | b << 8;
}

export function encodePosition(x: number, y: number, r: boolean) {
	const a = x & 0xff;
	const b = (x >> 8 & 0xf) | (y & 0xf) << 4;
	const c = (y >> 4 & 0x7f) | (r ? 1 : 0) << 7;
	return [a, b, c];
}

export function decodePosition(a: number, b: number, c: number) {
	const x = a | (b & 0xf) << 8;
	const y = b >> 4 | (c & 0x7f) << 4;
	const right = !!(c & 0x80);
	return {x, y, right};
}

export function encodeVelocity(vx: number, vy: number) {
	return (vx + 1) | (vy + 1) << 2
}

export function decodeVelocity(a: number) {
	const vx = (a & 0b11) - 1;
	const vy = ((a >> 2) & 0b11) - 1;
	return { vx, vy };
}

export function encodeMovement(id: number, x: number, y: number, right: boolean, vx: number, vy: number) {
	const ab = encodeId(id);
	const cde = encodePosition(x, y, right);
	const f = encodeVelocity(vx, vy);
	return [...ab, ...cde, f];
}

export function decodeMovement(a: number, b: number, c: number, d: number, e: number, f: number) {
	const id = decodeId(a, b);
	const xyr = decodePosition(c, d, e);
	const v = decodeVelocity(f);
	return { id, ...xyr, ...v };
}

export const MAX_TEXT_SIZE = 0xf;
export function encodeText(text: string) {
	const encoder = new TextEncoder();
	const buffer = encoder.encode(text);
	if (buffer.length > MAX_TEXT_SIZE) {
		console.warn(`Max text size reached: ${buffer.length}/${MAX_TEXT_SIZE}`);
		return buffer.slice(0, MAX_TEXT_SIZE - 1)
	}
	return buffer;
}

export function decodeText(data: Uint8Array, offset = 0) {
	const decoder = new TextDecoder();
	const length = data[offset++];
	return decoder.decode(data.slice(offset, offset + length));
}