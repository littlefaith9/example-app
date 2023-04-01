import { moveUpdate } from "../common/entityUtils";
import { Action } from "../common/interfaces";
import { Client } from "./socket";

export class ServerMap {
	clients: (Client | undefined)[] = [];
	lastCountUpdate = 0;
	lastMovementUpdate = 0;
	movementUpdated = new Map<number, Buffer>();
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
	update(now: number) {
		let count = 0;
		if (now - this.lastCountUpdate >= 800) {
			this.clients.forEach(c => {
				!!c && count++;
				c?.sendClientCount(count);
			});
		}
		moveUpdate(now, this.clients);
		const updates = [...this.movementUpdated.values()];
		const movementBuffer = Buffer.alloc(1 + 6 * updates.length, 0);
		movementBuffer[0] = Action.Move;
		for (let i = 0; i < updates.length; i++) {
			movementBuffer.set(updates[i], 1 + i * 6);
		}
		this.clients.forEach(c => c?.send(movementBuffer));
		setTimeout(() => this.update(Date.now()), 20);
	}
}