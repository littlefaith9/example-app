"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawTiles = void 0;
const game_1 = require("./game");
const sprites_1 = require("./sprites");
const utils_1 = require("./utils");
function drawTiles() {
    const buffer = (0, sprites_1.createCanvas)(game_1.CANVAS_WIDTH, game_1.CANVAS_HEIGHT);
    const mapContext = buffer.getContext('2d');
    for (let y = 0; y < game_1.CANVAS_WIDTH; y += sprites_1.TILE_HEIGHT) {
        for (let x = 0; x < game_1.CANVAS_WIDTH; x += sprites_1.TILE_WIDTH) {
            mapContext.drawImage((0, utils_1.sample)(sprites_1.sprites['tile_grass'].frames), x, y);
        }
    }
    return buffer;
}
exports.drawTiles = drawTiles;
