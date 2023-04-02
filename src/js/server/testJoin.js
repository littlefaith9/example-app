"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cws_1 = require("../../cws");
const encoding_1 = require("../common/encoding");
const entityUtils_1 = require("../common/entityUtils");
async function requestJoin() {
    const request = await fetch('http://localhost:8090/api-join', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: 'Perf',
    });
    const [port, id] = await request.text().then(t => t.split(','));
    const ws = new cws_1.WebSocket(`ws://localhost:${port}/`);
    const entity = (0, entityUtils_1.randomPosition)((0, entityUtils_1.createEntity)());
    ws.on('open', () => ws.send(Buffer.from([0, ...(0, encoding_1.encodeId)(parseInt(id, 10)), ...(0, encoding_1.encodePosition)(entity.x, entity.y, entity.right)])));
}
;
for (let i = 0; i < 100; i++) {
    requestJoin();
}
