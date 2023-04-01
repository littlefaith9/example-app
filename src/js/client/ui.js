"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInfoText = exports.createInfoText = exports.createTestButton = exports.createDiv = void 0;
const entityUtils_1 = require("../common/entityUtils");
const socket_1 = require("./socket");
function createDiv(container = document.body) {
    return container.appendChild(document.createElement('div'));
}
exports.createDiv = createDiv;
const createMockGame = () => ({
    connection: undefined,
    player: (0, entityUtils_1.randomPosition)((0, entityUtils_1.createEntity)()),
    entities: [],
    clients: 0,
});
function createTestButton(container = document.body) {
    const button = document.createElement('button');
    button.innerText = 'Add 100 clients';
    container.appendChild(button);
    button.onclick = () => {
        for (let i = 0; i < 100; i++) {
            const g = createMockGame();
            (0, socket_1.requestJoin)(g, 'test').then(connection => {
                g.connection = connection;
                connection.sendJoin(g.player.x, g.player.y, g.player.right);
            });
        }
    };
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
