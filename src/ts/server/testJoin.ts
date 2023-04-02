import { WebSocket } from '../../cws';
import { encodeId, encodePosition } from '../common/encoding';
import { createEntity, randomPosition } from '../common/entityUtils';
import { Action } from '../common/interfaces';

async function requestJoin() {
	const request = await fetch('http://localhost:8090/api-join', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'Perf',
	});
	const [port, id] = await request.text().then(t => t.split(','));
	const ws = new WebSocket(`ws://localhost:${port}/`);
	const entity = randomPosition(createEntity());
	ws.on('open', () => ws.send(Buffer.from([Action.Join, ...encodeId(parseInt(id, 10)), ...encodePosition(entity.x, entity.y, entity.right)])));
};

for (let i = 0; i < 100; i++) {
	requestJoin();
}
