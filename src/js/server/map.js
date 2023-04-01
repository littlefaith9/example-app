"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMap = void 0;
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
class ServerMap {
    constructor() {
        this.clients = [];
        this.lastCountUpdate = 0;
        this.lastMovementUpdate = 0;
        this.movementUpdated = new Set();
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
    encodeMovements() {
        let offset = 0;
        const ids = [...this.movementUpdated.keys()];
        this.movementUpdated.clear();
        const buffer = Buffer.alloc(1 + 6 * ids.length, 0);
        buffer[offset++] = 2;
        for (let index = 0; index < ids.length; index++) {
            const client = this.clients[ids[index]];
            if (!client)
                continue;
            const { x, y, right, vx, vy } = client.entity;
            buffer.set((0, encoding_1.encodeMovement)(client.id, x, y, right, vx, vy), offset);
            offset += 6;
        }
        return buffer;
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
        if (now - this.lastMovementUpdate >= 200) {
            this.lastMovementUpdate = now;
            const buffer = this.encodeMovements();
            this.clients.forEach(c => c?.send(buffer));
        }
        setTimeout(() => this.update(Date.now()), 20);
    }
}
exports.ServerMap = ServerMap;
