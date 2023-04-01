export function createDiv(container = document.body) {
	return container.appendChild(document.createElement('div'));
}

export function createTestButton(container = document.body) {
	const button = document.createElement('button');
	button.innerText = 'Add 100 clients';
	container.appendChild(button);
	return button;
}

let infoTextElement = document.createElement('div');
export function createInfoText(container = document.body) {
	container.appendChild(infoTextElement);
}
export function updateInfoText(text: string) {
	infoTextElement.innerText = text;
}