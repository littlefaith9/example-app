"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInfoText = exports.createInfoText = exports.createTestButton = exports.createDiv = void 0;
function createDiv(container = document.body) {
    return container.appendChild(document.createElement('div'));
}
exports.createDiv = createDiv;
function createTestButton(container = document.body) {
    const button = document.createElement('button');
    button.innerText = 'Add 100 clients';
    container.appendChild(button);
    return button;
}
exports.createTestButton = createTestButton;
let infoTextElement = document.createElement('div');
function createInfoText(container = document.body) {
    container.appendChild(infoTextElement);
}
exports.createInfoText = createInfoText;
function updateInfoText(text) {
    infoTextElement.innerText = text;
}
exports.updateInfoText = updateInfoText;
