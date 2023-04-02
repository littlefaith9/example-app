"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.CANVAS_HEIGHT = exports.CANVAS_WIDTH = void 0;
const entityUtils_1 = require("../common/entityUtils");
const draw_1 = require("./draw");
const socket_1 = require("./socket");
const sprites_1 = require("./sprites");
const ui_1 = require("./ui");
exports.CANVAS_WIDTH = 1024;
exports.CANVAS_HEIGHT = 768;
const MAX_FPS = 60;
const testEntity = (0, entityUtils_1.randomPosition)((0, entityUtils_1.createEntity)());
class Game {
    constructor(nickname, container = document.body) {
        this.lastDraw = 0;
        this.trotFrame = 0;
        this.lastInfoUpdate = 0;
        this.fps = 0;
        this.player = testEntity;
        this.entities = [];
        this.serverStat = '<no server stat>';
        this.canvas = document.createElement('canvas');
        this.canvas.width = exports.CANVAS_WIDTH;
        this.canvas.height = exports.CANVAS_HEIGHT;
        this.player.name = nickname;
        this.reconnect();
        container.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.context.textAlign = 'center';
        if (!this.context) {
            alert('Failed creating canvas context, refresh the page');
            throw new Error('Failed creating context');
        }
        addEventListener('keydown', ev => this.handleKeydown(ev), false);
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
        return `fps ${Math.floor(this.fps)} | connected ${!!this.connection?.connected} | (${this.player.x}, ${this.player.y}, ${this.player.right}) | ${this.serverStat}`;
    }
    drawMap() {
        if (!this.mapBuffer) {
            this.mapBuffer = (0, draw_1.drawTiles)();
        }
        this.context.drawImage(this.mapBuffer, 0, 0);
    }
    drawBanner(text) {
        this.context.save();
        this.context.fillStyle = '#333';
        this.context.fillRect(0, exports.CANVAS_HEIGHT / 2 - 40, exports.CANVAS_WIDTH, 80);
        this.context.fillStyle = '#fff';
        this.context.fillText(text, exports.CANVAS_WIDTH / 2, exports.CANVAS_HEIGHT / 2);
        this.context.restore();
    }
    handleKeydown(ev) {
        let vx = this.player.vx;
        let vy = this.player.vy;
        switch (ev.key) {
            case 'a':
            case 'ArrowLeft':
                vx = -1;
                break;
            case 'd':
            case 'ArrowRight':
                vx = 1;
                break;
            case 'w':
            case 'ArrowUp':
                vy = -1;
                break;
            case 's':
            case 'ArrowDown':
                vy = 1;
                break;
        }
        if (vx !== this.player.vx || vy !== this.player.vy) {
            this.player.vx = vx;
            this.player.vy = vy;
            this.connection?.sendMove(vx, vy);
        }
        if (ev.key !== 'F12') {
            ev.preventDefault();
        }
    }
    handleKeyup({ key }) {
        switch (key) {
            case 'a':
            case 'd':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.player.vx = 0;
                break;
            case 'w':
            case 's':
            case 'ArrowUp':
            case 'ArrowDown':
                this.player.vy = 0;
                break;
        }
        this.connection?.sendMove(0, 0);
    }
    drawEntity(entity) {
        this.context.save();
        let right = 1;
        if (entity.right) {
            this.context.scale(-1, 1);
            right = -1;
        }
        if ((0, entityUtils_1.isMoving)(entity)) {
            this.context.translate(-sprites_1.sprites['faith_trot'].centerX, -sprites_1.sprites['faith_trot'].centerY);
            this.context.drawImage(sprites_1.sprites['faith_trot'].frames[this.trotFrame], right * entity.x, entity.y);
        }
        else {
            this.context.translate(-sprites_1.sprites['faith_stand'].centerX, -sprites_1.sprites['faith_stand'].centerY);
            this.context.drawImage(sprites_1.sprites['faith_stand'].frames[0], right * entity.x, entity.y);
        }
        this.context.restore();
    }
    reconnect() {
        (0, socket_1.requestJoin)(this, this.player.name).then(connection => {
            this.connection = connection;
            this.entities.push(this.player);
            connection.sendJoin(this.player.x, this.player.y, this.player.right);
        });
    }
    draw() {
        this.context.clearRect(0, 0, exports.CANVAS_WIDTH, exports.CANVAS_HEIGHT);
        this.drawMap();
        for (let entity of this.entities) {
            this.drawEntity(entity);
        }
        if (!this.connection?.connected) {
            this.drawBanner('Connecting...');
        }
    }
    update(now) {
        (0, entityUtils_1.moveUpdate)(now, this.entities);
        if (now - this.lastDraw >= 1000 / MAX_FPS) {
            this.fps = 1000 / (now - this.lastDraw);
            this.trotFrame = Math.floor(now / 40) % sprites_1.trotFrames;
            this.lastDraw = now;
            this.draw();
        }
        if (now - this.lastInfoUpdate >= 2000) {
            this.lastInfoUpdate = now;
            (0, ui_1.updateInfoText)(this.infoText);
        }
        requestAnimationFrame(now => this.update(now));
    }
}
exports.Game = Game;
