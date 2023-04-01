export function sample<T>(array: T[]): T {
	if (!array.length) {
		throw new Error('No items in array');
	}
	const length = array.length;
	const index = Math.floor(Math.random() * length);
	return array[index];
}