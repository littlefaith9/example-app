import { Game } from './game';
import { initSprites } from './sprites';
import { createDiv, createInfoText, createTestButton, createTestHashButton } from './ui';

const defaultName = 'Faith Donk';
const nickname = prompt('Enter your nickname to join', defaultName) ?? defaultName;
document.title = nickname;

initSprites().then(() => {
	(window as any).game = new Game(nickname);
	const uibar = createDiv();
	createInfoText(uibar);
	createTestButton(uibar);
	createTestHashButton(uibar);

	// errors print to page
	const err = console.error;
	console.error = (...data: any[]) => {
		err(...data);
		const errorText = createDiv(uibar);
		errorText.innerHTML = '[error]' + data.join(' ');
	}
});
