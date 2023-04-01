"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const sprites_1 = require("./sprites");
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const MAX_FPS = 60;
class Game {
    constructor(container = document.body) {
        this.lastDraw = 0;
        this.entities = [];
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        container.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    drawMap() {
        if (!this.mapBuffer) {
            const buffer = (0, sprites_1.createCanvas)(CANVAS_WIDTH, CANVAS_HEIGHT);
            const mapContext = buffer.getContext('2d');
            for (let y = 0; y < CANVAS_WIDTH; y += sprites_1.TILE_HEIGHT) {
                for (let x = 0; x < CANVAS_WIDTH; x += sprites_1.TILE_WIDTH) {
                    mapContext.drawImage(sample(sprites_1.sprites['tile_grass'].frames), x, y);
                }
            }
            this.mapBuffer = buffer;
        }
        this.context.drawImage(this.mapBuffer, 0, 0);
    }
    draw() {
        if (!this.context) {
            return;
        }
        this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.drawMap();
    }
    update(now) {
        if (now - this.lastDraw >= 1000 / MAX_FPS) {
            this.draw();
        }
        requestAnimationFrame(now => this.update(now));
    }
}
exports.Game = Game;
