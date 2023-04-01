import { WebSocket } from '../../cws';
import { decodeId, decodeMovement, decodePosition, encodeId, encodePosition } from '../common/encoding';
import { createEntity } from '../common/entityUtils';
import { Action } from '../common/interfaces';
import { map } from './server';

export class Client {
	leave?: (id: number) => void;
	entity = createEntity();
	constructor (private ws: WebSocket) {
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
	handleMessage(data: Buffer) {
		const action = data[0];
		switch (action) {
			case Action.Join: {
				const id = decodeId(data[1], data[2]);
				map.joinClient(this, id);
				const {x, y, right} = decodePosition(data[3], data[4], data[5]);
				this.entity.id = id;
				this.entity.x = x;
				this.entity.y = y;
				this.entity.right = right;
			}
			case Action.Move: {
				const { x, y, vx, vy, right } = decodeMovement(data[1], data[2], data[3], data[4], data[5], data[6]);
				this.entity.x = x;
				this.entity.y = y;
				this.entity.vx = vx;
				this.entity.vy = vy;
				this.entity.right = right;
				map.movementUpdated.set(this.id, data.subarray(1, 6));
				break;
			}
		}
	}
	send(data: Buffer) {
		this.ws.send(data);
	}
	sendMap() {
		const buffer = Buffer.alloc(1 + 5 * map.clients.length, 0);
		buffer[0] = Action.Map;
		for (let i = 0; i < map.clients.length; i++) {
			const client = map.clients[i];
			if (!client) continue;
			buffer.set(encodeId(client.id), 1 + 5 * i);
			buffer.set(encodePosition(client.entity.x, client.entity.y, client.entity.right), 1 + 5 * i + 2);
		}
		this.ws.send(buffer);
	}
	sendJoin(id: number, x: number, y: number, r: boolean/*, name: string */) {
		const [a, b] = encodeId(id);
		const [c, d, e] = encodePosition(x, y, r);
		this.ws.send(Buffer.from([Action.Join, a, b, c, d, e]));
	}
	sendClientCount(count: number) {
		this.ws.send(Buffer.from([Action.ClientsCount, count]));
	}
	sendLeave(id: number) {
		const [a, b] = encodeId(id);
		this.ws.send(Buffer.from([Action.Leave, a, b]));
	}
}