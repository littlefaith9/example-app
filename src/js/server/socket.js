"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
const server_1 = require("./server");
class Client {
    constructor(ws) {
        this.ws = ws;
        this.entity = (0, entityUtils_1.createEntity)();
        ws.on('error', console.error);
        ws.on('message', data => this.handleMessage(Buffer.from(data)));
        ws.on('close', () => this.leave?.(this.id));
    }
    get id() {
        return this.entity.id;
    }
    get connected() {
        return this.ws.readyState === this.ws.OPEN;
    }
    handleMessage(data) {
        const action = data[0];
        switch (action) {
            case 0: {
                const id = (0, encoding_1.decodeId)(data[1], data[2]);
                const { x, y, right } = (0, encoding_1.decodePosition)(data[3], data[4], data[5]);
                this.entity.id = id;
                this.entity.x = x;
                this.entity.y = y;
                this.entity.right = right;
                server_1.map.joinClient(this, id);
                break;
            }
            case 2: {
                const { vx, vy } = (0, encoding_1.decodeVelocity)(data[1]);
                this.entity.vx = vx;
                this.entity.vy = vy;
                if (vx) {
                    this.entity.right = vx > 0;
                }
                server_1.map.movementUpdated.add(this.id);
                break;
            }
        }
    }
    send(data) {
        this.ws.send(data);
    }
    sendMap() {
        const buffer = Buffer.alloc(1 + 5 * server_1.map.clients.length, 0);
        buffer[0] = 4;
        let last = 1;
        for (let i = 0; i < server_1.map.clients.length; i++) {
            const client = server_1.map.clients[i];
            if (!client)
                continue;
            buffer.set((0, encoding_1.encodeId)(client.id), 1 + 5 * i);
            buffer.set((0, encoding_1.encodePosition)(client.entity.x, client.entity.y, client.entity.right), 1 + 5 * i + 2);
            last += 5;
        }
        this.ws.send(buffer.subarray(0, last));
    }
    sendJoin(id, x, y, r) {
        const [a, b] = (0, encoding_1.encodeId)(id);
        const [c, d, e] = (0, encoding_1.encodePosition)(x, y, r);
        this.ws.send(Buffer.from([0, a, b, c, d, e]));
    }
    sendClientStat(stat) {
        const encoded = Buffer.from(stat, 'utf-8');
        this.ws.send(Buffer.from([3, ...encoded]));
    }
    sendLeave(id) {
        const [a, b] = (0, encoding_1.encodeId)(id);
        this.ws.send(Buffer.from([1, a, b]));
    }
}
exports.Client = Client;
