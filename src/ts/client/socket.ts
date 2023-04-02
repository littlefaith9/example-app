import { decodeId, decodeMovement, decodePosition, encodeId, encodeVelocity, encodePosition } from '../common/encoding';
import { createFromJoin } from '../common/entityUtils';
import { Action } from '../common/interfaces';
import { Game } from './game';

export class ServerAction {
	constructor (private ws: WebSocket, private game: Game, private id: number) {
		ws.onmessage = ev => this.handleMsg(ev);
		ws.onclose = () => {
			game.entities.length = 0;
			setTimeout(() => game.reconnect(), 3000);
		}
		this.game.player.id = id;
	}
	async handleMsg({ data }: MessageEvent<Blob>) {
		if (!data.size) return;
		const buffer = new Uint8Array(await data.arrayBuffer());
		const action = buffer[0];
		switch (action) {
			case Action.ClientsStat:
				this.game.serverStat = await data.slice(1).text();
				break;
			case Action.Join: {
				const id = decodeId(buffer[1], buffer[2]);
				if (id === this.id) break;
				const { x, y, right } = decodePosition(buffer[3], buffer[4], buffer[5]);
				this.game.entities.push(createFromJoin(id, x, y, right));
				break;
			}
			case Action.Map: {
				let i = 1;
				while (i < buffer.length) {
					const id = decodeId(buffer[i++], buffer[i++]);
					if (id === this.id) { i += 3; continue; }
					const { x, y, right } = decodePosition(buffer[i++], buffer[i++], buffer[i++]);
					this.game.entities.push(createFromJoin(id, x, y, right));
				}
				break;
			}
			case Action.Leave:
				const id = decodeId(buffer[1], buffer[2]);
				const index = this.game.entities.findIndex(e => e.id === id);
				if (index !== -1) {
					this.game.entities.splice(index);
				}
			case Action.Move:
				let i = 1;
				while (i < buffer.length) {
					const { id, x, y, right, vx, vy } = decodeMovement(buffer[i++], buffer[i++], buffer[i++], buffer[i++], buffer[i++], buffer[i++]);
					const entity = this.game.entities.find(e => e.id === id);
					if (!entity) {
						console.warn('Cannot find entity ' + id);
						continue;
					}

					// update position, and velocity if it's other player
					entity.right = right;
					entity.x = x; entity.y = y;
					if (id !== this.id) {
						entity.vx = vx; entity.vy = vy;
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
	sendJoin(x: number, y: number, r: boolean) {
		this.ws.send(new Uint8Array([Action.Join, ...encodeId(this.id), ...encodePosition(x, y, r)]));
	}
	sendMove(vx: number, vy: number) {
		this.ws.send(new Uint8Array([Action.Move, encodeVelocity(vx, vy)]));
	}
	disconnect() {
		this.ws.close();
	}
}

export async function requestJoin(game: Game, nickname: string) {
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
	return new Promise<ServerAction>(resolve => {
		socket.onopen = () => resolve(serverAction);
	});
}