import { Game } from "./game";
import { initSprites } from "./sprites";
import { createDiv, createInfoText, createTestButton } from "./ui";

const defaultName = 'Faith Donk';
const nickname = prompt('Enter your nickname to join', defaultName) ?? defaultName;
document.title = nickname;

initSprites().then(() => {
	(window as any).game = new Game(nickname);
	const uibar = createDiv();
	createInfoText(uibar);
	createTestButton(uibar);
});
