import path from 'path';

export function pathTo(...relativePath: string[]) {
	return path.join(__dirname, '..', '..', '..', ...relativePath);
}