
interface Sprite {
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	frames: HTMLCanvasElement[];
}

export const sprites: { [name: string]: Sprite } = {}

const loadImage = (name: string) => new Promise<HTMLImageElement>((resolve, reject) => {
	const image = document.createElement('img');
	const timeout = setTimeout(() => reject('request timed out'), 5000)
	image.onload = () => {
		resolve(image);
		clearTimeout(timeout);
	};
	image.src = name;
});

export function createCanvas(width: number, height: number) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function * splitImageToSprite(image: HTMLImageElement, width: number, height: number) {
	const imageWidth = image.width;
	const imageHeight = image.height;
	for (let y = 0; y <= imageHeight - height; y += height) {
		for (let x = 0; x <= imageWidth - width; x += width) {
			const canvas = createCanvas(width, height);
			const context = canvas.getContext('2d')!;
			context.drawImage(image, x, y, width, height, 0, 0, width, height);
			yield canvas;
		}
	}
}

function createSprite(name: string, image: HTMLImageElement, width: number, height: number, centerX: number, centerY: number) {
	sprites[name] = {
		width, height, centerX, centerY,
		frames: [...splitImageToSprite(image, width, height)],
	}
}

export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 24;

export async function initSprites() {
	const [grassImage, trotAnimation, standImage] = await Promise.all([
		loadImage('/assets/grass.png'),
		loadImage('/assets/trot.png'),
		loadImage('/assets/stand.png'),
	]);
	createSprite('tile_grass', grassImage, 32, 24, 0, 0);
	createSprite('faith_trot', trotAnimation, 43, 56, 22, 53);
	createSprite('faith_stand', standImage, 43, 54, 22, 51);
}
