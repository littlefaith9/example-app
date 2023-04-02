export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export async function delay(duration: number) {
	return new Promise<void>(resolve => setTimeout(resolve, duration));
}