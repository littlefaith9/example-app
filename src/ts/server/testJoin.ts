import { WebSocket } from '../../cws';
import { encodeId, encodePosition, encodeVelocity } from '../common/encoding';
import { createEntity, randomPosition } from '../common/entityUtils';
import { Action } from '../common/interfaces';
import { delay } from '../common/utils';

const clients: WebSocket[] = [];

async function requestJoin() {
	const request = await fetch('http://localhost:8090/api-join', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'Perf',
	});
	const [port, id] = await request.text().then(t => t.split(','));
	const entity = randomPosition(createEntity());

	const ws = new WebSocket(`ws://localhost:${port}/`);
	ws.on('open', () => ws.send(Buffer.from([Action.Join, ...encodeId(parseInt(id, 10)), ...encodePosition(entity.x, entity.y, entity.right)])));
	clients.push(ws);
};

for (let i = 0; i < 100; i++) {
	requestJoin();
}

let moving = false;

process.stdin.on('data', ev => {
	const command = ev.toString('utf-8');
	if (/\/move/.test(command)) {
		moving = !moving;
		console.log('Movement set to: ' + moving);
	} else {
		console.error('Invalid command: ' + command);
	}
});

(async () => {
	while (true) {
		for (let client of clients) {
			const movement = Math.random();
			if (!moving || movement < 0.3) {
				client.send(Buffer.from([Action.Move, encodeVelocity(0, 0)]));
			} else if (movement < 0.6) {
				const vx = Math.floor(Math.random() * 3) - 1;
				const vy = Math.floor(Math.random() * 3) - 1;
				client.send(Buffer.from([Action.Move, encodeVelocity(vx, vy)]));
			}
		}
		await delay(500);
	}
})();
