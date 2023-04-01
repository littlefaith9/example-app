"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const express_1 = __importDefault(require("express"));
const cws_1 = require("../../cws");
const map_1 = require("./map");
const socket_1 = require("./socket");
const utils_1 = require("./utils");
const PORT = 8090;
const WS_PORT = 8091;
const app = (0, express_1.default)();
const socketServer = new cws_1.WebSocketServer({ port: WS_PORT }, () => console.log('WebSocket Server listening on port ' + WS_PORT));
exports.map = new map_1.ServerMap();
app.use('/assets/', express_1.default.static((0, utils_1.pathTo)('assets')));
app.use('/', express_1.default.static((0, utils_1.pathTo)('public')));
app.post('/api-join', (request, response) => {
    response.send(`${WS_PORT},${exports.map.assignId(request.body)}`);
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
socketServer.on('connection', ws => {
    new socket_1.Client(ws);
});
