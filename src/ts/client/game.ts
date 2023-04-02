import { createEntity, isMoving, moveUpdate, randomPosition } from "../common/entityUtils";
import { EntityBase } from "../common/interfaces";
import { drawTiles } from "./draw";
import { requestJoin, ServerAction } from "./socket";
import { sprites } from "./sprites";
import { updateInfoText } from "./ui";

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;
const MAX_FPS = 60;

const testEntity = randomPosition(createEntity());

export class Game {
	private readonly canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private mapBuffer?: HTMLCanvasElement;
	private lastDraw = 0;
	private trotFrame = 0;
	private lastInfoUpdate = 0;
	private fps = 0;
	connection?: ServerAction;
	player = testEntity;
	readonly entities: EntityBase[] = [testEntity];
	serverStat = '';
	constructor (nickname: string, container = document.body) {
		// create canvas
		this.canvas = document.createElement('canvas');
		this.canvas.width = CANVAS_WIDTH;
		this.canvas.height = CANVAS_HEIGHT;

		requestJoin(this, nickname).then(connection => {
			this.connection = connection;
			connection.sendJoin(this.player.x, this.player.y, this.player.right);
		});

		container.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d')!;
		this.context.textAlign = 'center';
		if (!this.context) {
			alert('Failed creating canvas context, refresh the page');
			throw new Error('Failed creating context');
		}

		addEventListener('keydown', ev => this.handleKeydown(ev));
		addEventListener('keyup', ev => this.handleKeyup(ev));
		requestAnimationFrame(now => this.update(now));
	}
	get width() {
		return this.canvas.width;
	}
	get height() {
		return this.canvas.height;
	}
	get infoText() {
		return `fps ${Math.floor(this.fps)} | connected ${!!this.connection?.connected} | (${this.player.x}, ${this.player.y}, ${this.player.right}) | ${this.serverStat}`
	}
	private drawMap() {
		// if there's no saved buffer, create it
		if (!this.mapBuffer) {
			this.mapBuffer = drawTiles();
		}
		// draw map directly from saved buffer
		this.context.drawImage(this.mapBuffer, 0, 0);
	}
	private drawBanner(text: string) {
		this.context.save();
		this.context.fillStyle = '#333';
		this.context.fillRect(0, CANVAS_HEIGHT / 2 - 40, CANVAS_WIDTH, 80);
		this.context.fillStyle = '#fff';
		this.context.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		this.context.restore();
	}
	private handleKeydown({ key }: KeyboardEvent) {
		switch (key) {
			case 'ArrowLeft':
				this.player.vx = -1;
				break;
			case 'ArrowRight':
				this.player.vx = 1;
				break;
			case 'ArrowUp':
				this.player.vy = -1;
				break;
			case 'ArrowDown':
				this.player.vy = 1;
				break;
		}
		this.connection?.sendMove();
	}
	private handleKeyup({ key }: KeyboardEvent) {
		switch (key) {
			case 'ArrowLeft':
			case 'ArrowRight':
				this.player.vx = 0;
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				this.player.vy = 0;
				break;
		}
		this.connection?.sendMove();
	}
	drawEntity(entity: EntityBase) {
		this.context.save();
		let right = 1;
		if (entity.right) {
			this.context.scale(-1, 1);
			right = -1;
		}
		if (isMoving(entity)) {
			this.context.translate(-sprites['faith_trot'].centerX, -sprites['faith_trot'].centerY);
			this.context.drawImage(sprites['faith_trot'].frames[this.trotFrame], right * entity.x, entity.y);
		} else {
			this.context.translate(-sprites['faith_stand'].centerX, -sprites['faith_stand'].centerY);
			this.context.drawImage(sprites['faith_stand'].frames[0], right * entity.x, entity.y);
		}
		this.context.restore();
	}
	draw() {
		this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.drawMap();

		for (let entity of this.entities) {
			this.drawEntity(entity);
		}
	}
	update(now: number) {
		moveUpdate(now, this.entities);
		if (now - this.lastDraw >= 1000 / MAX_FPS) {
			this.fps = 1000 / (now - this.lastDraw);
			this.trotFrame = Math.floor(now / 40) % sprites['faith_trot'].frames.length;
			this.lastDraw = now;
			this.draw();
			// only draw when not connected
			if (!this.connection?.connected) {
				this.drawBanner('Connecting...');
			}
		}
		if (now - this.lastInfoUpdate >= 2000) {
			this.lastInfoUpdate = now;
			updateInfoText(this.infoText);
		}
		requestAnimationFrame(now => this.update(now));
	}
}