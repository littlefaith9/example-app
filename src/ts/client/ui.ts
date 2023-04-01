import { createEntity, randomPosition } from "../common/entityUtils";
import { requestJoin } from "./socket";

export function createDiv(container = document.body) {
	return container.appendChild(document.createElement('div'));
}

const createMockGame: () => any = () => ({
	connection: undefined,
	player: randomPosition(createEntity()),
	entities: [],
	clients: 0,
})

export function createTestButton(container = document.body) {
	const button = document.createElement('button');
	button.innerText = 'Add 100 clients';
	container.appendChild(button);
	button.onclick = () => {
		for (let i = 0; i < 100; i++) {
			const g = createMockGame();
			requestJoin(g, 'test').then(connection => {
				g.connection = connection;
				connection.sendJoin(g.player.x, g.player.y, g.player.right);
			});
		}
	}
	return button;
}

let infoTextElement = document.createElement('div');
export function createInfoText(container = document.body) {
	container.appendChild(infoTextElement);
}
export function updateInfoText(text: string) {
	infoTextElement.innerText = text;
}