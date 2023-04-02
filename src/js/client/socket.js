"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestJoin = exports.ServerAction = void 0;
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
class ServerAction {
    constructor(ws, game, id) {
        this.ws = ws;
        this.game = game;
        this.id = id;
        ws.onmessage = ev => this.handleMsg(ev);
        ws.onclose = () => {
            game.entities.length = 0;
            setTimeout(() => game.reconnect(), 3000);
        };
        this.game.player.id = id;
    }
    async handleMsg({ data }) {
        if (!data.size)
            return;
        const buffer = new Uint8Array(await data.arrayBuffer());
        const action = buffer[0];
        switch (action) {
            case 3:
                this.game.serverStat = await data.slice(1).text();
                break;
            case 0: {
                const id = (0, encoding_1.decodeId)(buffer[1], buffer[2]);
                if (id === this.id)
                    break;
                const { x, y, right } = (0, encoding_1.decodePosition)(buffer[3], buffer[4], buffer[5]);
                const name = (0, encoding_1.decodeText)(buffer, 6);
                this.game.entities.push((0, entityUtils_1.createFromJoin)(id, x, y, right, name));
                break;
            }
            case 4: {
                let i = 1;
                while (i < buffer.length) {
                    const id = (0, encoding_1.decodeId)(buffer[i++], buffer[i++]);
                    if (id === this.id) {
                        i += 3;
                        continue;
                    }
                    const { x, y, right } = (0, encoding_1.decodePosition)(buffer[i++], buffer[i++], buffer[i++]);
                    const name = (0, encoding_1.decodeText)(buffer, i);
                    const length = buffer[i++];
                    i += length;
                    this.game.entities.push((0, entityUtils_1.createFromJoin)(id, x, y, right, name));
                }
                break;
            }
            case 1:
                const id = (0, encoding_1.decodeId)(buffer[1], buffer[2]);
                const index = this.game.entities.findIndex(e => e.id === id);
                if (index !== -1) {
                    this.game.entities.splice(index, 1);
                }
            case 2:
                let i = 1;
                while (i < buffer.length) {
                    const { id, x, y, right, vx, vy } = (0, encoding_1.decodeMovement)(buffer[i++], buffer[i++], buffer[i++], buffer[i++], buffer[i++], buffer[i++]);
                    const entity = this.game.entities.find(e => e.id === id);
                    if (!entity) {
                        console.warn('Cannot find entity ' + id);
                        continue;
                    }
                    entity.right = right;
                    entity.x = x;
                    entity.y = y;
                    if (id !== this.id) {
                        entity.vx = vx;
                        entity.vy = vy;
                    }
                }
                break;
            default:
                console.error('Unknown action' + action);
                break;
        }
    }
    get connected() {
        return this.ws.readyState === this.ws.OPEN;
    }
    sendJoin(x, y, r) {
        this.ws.send(new Uint8Array([0, ...(0, encoding_1.encodeId)(this.id), ...(0, encoding_1.encodePosition)(x, y, r)]));
    }
    sendMove(vx, vy) {
        this.ws.send(new Uint8Array([2, (0, encoding_1.encodeVelocity)(vx, vy)]));
    }
    disconnect() {
        this.ws.close();
    }
}
exports.ServerAction = ServerAction;
async function requestJoin(game, nickname) {
    const response = await fetch('/api-join', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: nickname,
    });
    const [port, id] = (await response.text()).split(',');
    const socket = new WebSocket(`ws://${location.hostname}:${port}/`);
    const serverAction = new ServerAction(socket, game, parseInt(id, 10));
    return new Promise(resolve => {
        socket.onopen = () => resolve(serverAction);
    });
}
exports.requestJoin = requestJoin;
