"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMap = void 0;
const entityUtils_1 = require("../common/entityUtils");
class ServerMap {
    constructor() {
        this.clients = [];
        this.lastCountUpdate = 0;
        this.lastMovementUpdate = 0;
        this.movementUpdated = new Map();
        this.nameMapping = new Map();
        this.update(Date.now());
    }
    ;
    assignId(nickname) {
        let id = 0;
        while (true) {
            if (!this.clients[id] && !this.nameMapping.has(id)) {
                this.nameMapping.set(id, nickname);
                return id;
            }
            id++;
        }
    }
    joinClient(client, id) {
        this.clients.forEach(c => c?.sendJoin(id, client.entity.x, client.entity.y, client.entity.right));
        client.sendMap();
        this.clients[id] = client;
        const name = this.nameMapping.get(id);
        if (!name) {
            console.warn('Missing preserved name for client id: ' + id);
        }
        client.entity.name = name || 'Unknown';
        this.nameMapping.delete(id);
        client.leave = this.leaveClient.bind(this);
    }
    leaveClient(id) {
        this.clients[id] = undefined;
        this.clients.forEach(c => c?.sendLeave(id));
    }
    update(now) {
        let count = 0;
        if (now - this.lastCountUpdate >= 800) {
            this.clients.forEach(c => {
                !!c && count++;
                c?.sendClientCount(count);
            });
        }
        (0, entityUtils_1.moveUpdate)(now, this.clients);
        const updates = [...this.movementUpdated.values()];
        const movementBuffer = Buffer.alloc(1 + 6 * updates.length, 0);
        movementBuffer[0] = 2;
        for (let i = 0; i < updates.length; i++) {
            movementBuffer.set(updates[i], 1 + i * 6);
        }
        this.clients.forEach(c => c?.send(movementBuffer));
        setTimeout(() => this.update(Date.now()), 20);
    }
}
exports.ServerMap = ServerMap;
