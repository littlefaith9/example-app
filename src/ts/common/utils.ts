export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export async function delay(duration: number) {
	return new Promise<void>(resolve => setTimeout(resolve, duration));
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function randomString(length: number) {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}