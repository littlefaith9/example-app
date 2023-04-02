"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMap = void 0;
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
class ServerMap {
    constructor() {
        this.clients = [];
        this.lastStatUpdate = 0;
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
        const name = this.nameMapping.get(id);
        client.entity.name = name || '';
        this.nameMapping.delete(id);
        if (name === undefined) {
            console.warn('Missing preserved name for client id: ' + id);
        }
        client.sendMap();
        const ids = [];
        this.clients.forEach(c => c && ids.push(c.id));
        const movement = this.encodeMovements(ids);
        client.send(movement);
        client.leave = this.leaveClient.bind(this);
        this.clients.forEach(c => c?.sendJoin(id, client));
        this.clients[id] = client;
    }
    leaveClient(id) {
        this.clients[id] = undefined;
        this.clients.forEach(c => c?.sendLeave(id));
    }
    encodeMovements(ids) {
        const buffer = Buffer.alloc(1 + 6 * ids.length, 0);
        let offset = 0;
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
        (0, entityUtils_1.moveUpdate)(now, this.clients);
        if (now - this.lastMovementUpdate >= 50) {
            this.lastMovementUpdate = now;
            const ids = [...this.movementUpdated.keys()];
            this.movementUpdated.clear();
            const buffer = this.encodeMovements(ids);
            this.clients.forEach(c => c?.send(buffer));
        }
        setTimeout(() => this.update(Date.now()), 10);
    }
}
exports.ServerMap = ServerMap;
