import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./game";
import { createCanvas, sprites, TILE_HEIGHT, TILE_WIDTH } from "./sprites";
import { sample } from "./utils";

export function drawTiles() {
	const buffer = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	const mapContext = buffer.getContext('2d')!;

	for (let y = 0; y < CANVAS_WIDTH; y += TILE_HEIGHT) {
		for (let x = 0; x < CANVAS_WIDTH; x += TILE_WIDTH) {
			mapContext.drawImage(sample(sprites['tile_grass'].frames), x, y);
		}
	}

	return buffer;
}