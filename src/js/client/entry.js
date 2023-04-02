"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const sprites_1 = require("./sprites");
const ui_1 = require("./ui");
const defaultName = 'Faith Donk';
const nickname = prompt('Enter your nickname to join', defaultName) ?? defaultName;
document.title = nickname;
(0, sprites_1.initSprites)().then(() => {
    window.game = new game_1.Game(nickname);
    const uibar = (0, ui_1.createDiv)();
    (0, ui_1.createInfoText)(uibar);
    (0, ui_1.createTestButton)(uibar);
    const err = console.error;
    console.error = (...data) => {
        err(...data);
        const errorText = (0, ui_1.createDiv)(uibar);
        errorText.innerHTML = '[error]' + data.join(' ');
    };
});
