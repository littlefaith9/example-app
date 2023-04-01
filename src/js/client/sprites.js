"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSprites = exports.TILE_HEIGHT = exports.TILE_WIDTH = exports.createCanvas = exports.sprites = void 0;
exports.sprites = {};
const loadImage = (name) => new Promise((resolve, reject) => {
    const image = document.createElement('img');
    const timeout = setTimeout(() => reject('request timed out'), 5000);
    image.onload = () => {
        resolve(image);
        clearTimeout(timeout);
    };
    image.src = name;
});
function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
exports.createCanvas = createCanvas;
function* splitImageToSprite(image, width, height) {
    const imageWidth = image.width;
    const imageHeight = image.height;
    for (let y = 0; y <= imageHeight - height; y += height) {
        for (let x = 0; x <= imageWidth - width; x += width) {
            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');
            context.drawImage(image, x, y, width, height, 0, 0, width, height);
            yield canvas;
        }
    }
}
function createSprite(name, image, width, height, centerX, centerY) {
    exports.sprites[name] = {
        width, height, centerX, centerY,
        frames: [...splitImageToSprite(image, width, height)],
    };
}
exports.TILE_WIDTH = 32;
exports.TILE_HEIGHT = 24;
async function initSprites() {
    const [grassImage, trotAnimation, standImage] = await Promise.all([
        loadImage('/assets/grass.png'),
        loadImage('/assets/trot.png'),
        loadImage('/assets/stand.png'),
    ]);
    createSprite('tile_grass', grassImage, 32, 24, 0, 0);
    createSprite('faith_trot', trotAnimation, 43, 56, 22, 53);
    createSprite('faith_stand', standImage, 43, 54, 22, 51);
}
exports.initSprites = initSprites;
