import { encodeMovement } from "../common/encoding";
import { moveUpdate } from "../common/entityUtils";
import { Action } from "../common/interfaces";
import { Client } from "./socket";

export class ServerMap {
	clients: (Client | undefined)[] = [];
	lastStatUpdate = 0;
	lastMovementUpdate = 0;
	movementUpdated = new Set<number>();
	nameMapping = new Map<number, string>()
	constructor() {
		this.update(Date.now());
	};
	assignId(nickname: string) {
		let id = 0;
		while (true) {
			if (!this.clients[id] && !this.nameMapping.has(id)) {
				this.nameMapping.set(id, nickname);
				return id;
			}
			id++;
		}
	}
	joinClient(client: Client, id: number) {
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
	leaveClient(id: number) {
		this.clients[id] = undefined;
		this.clients.forEach(c => c?.sendLeave(id));
	}
	encodeMovements() {
		let offset = 0;
		const ids = [...this.movementUpdated.keys()];
		this.movementUpdated.clear();
		const buffer = Buffer.alloc(1 + 6 * ids.length, 0);
		buffer[offset++] = Action.Move;
		for (let index = 0; index < ids.length; index++) {
			const client = this.clients[ids[index]];
			if (!client) continue;
			const { x, y, right, vx, vy } = client.entity;
			buffer.set(encodeMovement(client.id, x, y, right, vx, vy), offset);
			offset += 6;
		}
		return buffer;
	}
	update(now: number) {
		// if (now - this.lastStatUpdate >= 800) {
		// 	this.lastStatUpdate = now;
		// 	this.clients.forEach(c => {
		// 		c?.sendClientStat(JSON.stringify(c.entity));
		// 	});
		// }
		moveUpdate(now, this.clients);
		if (now - this.lastMovementUpdate >= 200) {
			this.lastMovementUpdate = now;
			const buffer = this.encodeMovements();
			this.clients.forEach(c => c?.send(buffer));
		}
		setTimeout(() => this.update(Date.now()), 20);
	}
}