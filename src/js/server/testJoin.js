"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cws_1 = require("../../cws");
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
const utils_1 = require("../common/utils");
const clients = [];
const hashed = process.argv.includes('--hash');
async function requestJoin() {
    const request = await fetch('http://localhost:8090/api-join', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: hashed ? (0, utils_1.randomString)(15) : '',
    });
    const [port, id] = await request.text().then(t => t.split(','));
    const entity = (0, entityUtils_1.randomPosition)((0, entityUtils_1.createEntity)());
    const ws = new cws_1.WebSocket(`ws://localhost:${port}/`);
    ws.on('open', () => ws.send(Buffer.from([0, ...(0, encoding_1.encodeId)(parseInt(id, 10)), ...(0, encoding_1.encodePosition)(entity.x, entity.y, entity.right)])));
    clients.push(ws);
}
;
for (let i = 0; i < 100; i++) {
    requestJoin();
}
let moving = false;
process.stdin.on('data', ev => {
    const command = ev.toString('utf-8');
    if (/\/move/.test(command)) {
        moving = !moving;
        console.log('Movement set to: ' + moving);
    }
    else {
        console.error('Invalid command: ' + command);
    }
});
(async () => {
    while (true) {
        for (let client of clients) {
            const movement = Math.random();
            if (!moving) {
                client.send(Buffer.from([2, (0, encoding_1.encodeVelocity)(0, 0)]));
            }
            else if (movement < 0.6) {
                const vx = Math.floor(Math.random() * 3) - 1;
                const vy = Math.floor(Math.random() * 3) - 1;
                client.send(Buffer.from([2, (0, encoding_1.encodeVelocity)(vx, vy)]));
            }
        }
        await (0, utils_1.delay)(500);
    }
})();
