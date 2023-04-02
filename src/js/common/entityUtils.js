"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveUpdate = exports.isMoving = exports.randomPosition = exports.createFromJoin = exports.createEntity = void 0;
const utils_1 = require("./utils");
function createEntity() {
    return { id: 0, x: 0, y: 0, vx: 0, vy: 0, right: false, name: 'Faith Donk' };
}
exports.createEntity = createEntity;
function createFromJoin(id, x, y, right) {
    return { id, x, y, right, vx: 0, vy: 0, name: 'Faith Donk' };
}
exports.createFromJoin = createFromJoin;
function randomPosition(entity) {
    entity.x = Math.floor(1024 * Math.random());
    entity.y = Math.floor(768 * Math.random());
    entity.right = Math.random() < 0.5;
    return entity;
}
exports.randomPosition = randomPosition;
function isMoving(entity) {
    return entity.vx !== 0 || entity.vy !== 0;
}
exports.isMoving = isMoving;
let lastMoveUpdate = 0;
function moveUpdate(now, entities) {
    if (now - lastMoveUpdate >= 20) {
        lastMoveUpdate = now;
        entities.forEach(e => {
            if (!e)
                return;
            if ('entity' in e) {
                if (isMoving(e.entity)) {
                    e.entity.x = (0, utils_1.clamp)(2 * e.entity.vx + e.entity.x, 0, 1024);
                    e.entity.y = (0, utils_1.clamp)(2 * e.entity.vy + e.entity.y, 0, 768);
                    if (e.entity.vx !== 0) {
                        e.entity.right = e.entity.vx > 0;
                    }
                }
            }
            else {
                if (isMoving(e)) {
                    e.x = (0, utils_1.clamp)(2 * e.vx + e.x, 0, 1024);
                    e.y = (0, utils_1.clamp)(2 * e.vy + e.y, 0, 768);
                    if (e.vx !== 0) {
                        e.right = e.vx > 0;
                    }
                }
            }
        });
    }
}
exports.moveUpdate = moveUpdate;
