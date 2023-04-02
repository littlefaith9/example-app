import { WebSocket } from '../../cws';
import { decodeId, decodePosition, decodeVelocity, encodeId, encodePosition, encodeText } from '../common/encoding';
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
				const {x, y, right} = decodePosition(data[3], data[4], data[5]);
				this.entity.id = id;
				this.entity.x = x;
				this.entity.y = y;
				this.entity.right = right;
				map.joinClient(this, id);
				break;
			}
			case Action.Move: {
				const { vx, vy } = decodeVelocity(data[1]);
				this.entity.vx = vx;
				this.entity.vy = vy;
				if (vx) {
					this.entity.right = vx > 0;
				}
				map.movementUpdated.add(this.id);
				break;
			}
		}
	}
	send(data: Buffer) {
		this.ws.send(data);
	}
	sendMap() {
		const buffer = Buffer.alloc(255, 0);
		buffer[0] = Action.Map;
		let last = 1;
		for (let i = 0; i < map.clients.length; i++) {
			if (last > 200) {
				this.ws.send(buffer.subarray(0, last));
				buffer.fill(0);
				buffer[0] = Action.Map;
				last = 1;
			}
			const client = map.clients[i];
			if (!client) continue;

			let offset = last;
			buffer.set(encodeId(client.id), offset);
			buffer.set(encodePosition(client.entity.x, client.entity.y, client.entity.right), offset + 2);
			last += 5;

			const name = encodeText(client.entity.name);
			buffer.set([name.length], offset + 5);
			buffer.set(name, offset + 6);
			last += 1 + name.length;
		}
		this.ws.send(buffer.subarray(0, last));
	}
	sendJoin(id: number, client: Client) {
		const { x, y, right, name } = client.entity;
		const [a, b] = encodeId(id);
		const [c, d, e] = encodePosition(x, y, right);
		const f = encodeText(name);
		this.ws.send(Buffer.from([Action.Join, a, b, c, d, e, f.length, ...f]));
	}
	sendClientStat(stat: string) {
		const encoded = Buffer.from(stat, 'utf-8');
		this.ws.send(Buffer.from([Action.ClientsStat, ...encoded]));
	}
	sendLeave(id: number) {
		const [a, b] = encodeId(id);
		this.ws.send(Buffer.from([Action.Leave, a, b]));
	}
}