"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
exports.noop = () => { };
exports.OPCODE_TEXT = 1;
exports.OPCODE_PING = 9;
exports.OPCODE_BINARY = 2;
exports.APP_PING_CODE = Buffer.from('9');
exports.PERMESSAGE_DEFLATE = 1;
exports.SLIDING_DEFLATE_WINDOW = 16;
exports.DEFAULT_PAYLOAD_LIMIT = 16777216;
exports.native = (() => {
    try {
        return require(`./cws_${process.platform}_${process.versions.modules}`);
    }
    catch (err) {
		console.error(`Node Version 18 is required for CWS.
		If you are updating NodeJS version for this repository,
		Go to https://github.com/56789a1987/cWS/ ,
		Install the compatible binaries, then put into "<repo>/src/fixes/cws"`);
        err.message = err.message;
        throw err;
    }
})();
function setupNative(group, type, wsServer) {
    exports.native.setNoop(exports.noop);
    exports.native[type].group.onConnection(group, (external) => {
        if (type === 'server' && wsServer) {
            const socket = new client_1.WebSocket(null, { external });
            exports.native.setUserData(external, socket);
            if (wsServer.upgradeCb) {
                wsServer.upgradeCb(socket);
            }
            else {
                wsServer.registeredEvents['connection'](socket, wsServer.upgradeReq);
            }
            wsServer.upgradeCb = null;
            wsServer.upgradeReq = null;
            return;
        }
        const webSocket = exports.native.getUserData(external);
        webSocket.external = external;
        webSocket.registeredEvents['open']();
    });
    exports.native[type].group.onPing(group, (message, webSocket) => {
        webSocket.registeredEvents['ping'](message);
    });
    exports.native[type].group.onPong(group, (message, webSocket) => {
        webSocket.registeredEvents['pong'](message);
    });
    exports.native[type].group.onMessage(group, (message, webSocket) => {
        webSocket.registeredEvents['message'](message);
    });
    exports.native[type].group.onDisconnection(group, (newExternal, code, message, webSocket) => {
        webSocket.external = null;
        process.nextTick(() => {
            webSocket.registeredEvents['close'](code || 1005, message || '');
        });
        exports.native.clearUserData(newExternal);
    });
    if (type === 'client') {
        exports.native[type].group.onError(group, (webSocket) => {
            process.nextTick(() => {
                webSocket.registeredEvents['error']({
                    message: 'cWs client connection error',
                    stack: 'cWs client connection error'
                });
            });
        });
    }
}
exports.setupNative = setupNative;
