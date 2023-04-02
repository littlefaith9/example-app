import express from 'express';
import { WebSocketServer } from '../../cws';
import { ServerMap } from './map';
import { Client } from './socket';
import { pathTo } from './utils';
import { spawn } from 'child_process';
import bodyParser from 'body-parser';

const PORT = 8090;
const WS_PORT = 8091;
const app = express();
const socketServer = new WebSocketServer({ port: WS_PORT }, () => console.log('WebSocket Server listening on port: ' + WS_PORT));
export const map = new ServerMap();

app.use('/assets/', express.static(pathTo('assets')));
app.use('/', express.static(pathTo('public')));

app.post('/api-join', bodyParser.text(), (request, response) => {
	response.send(`${WS_PORT},${map.assignId(request.body)}`);
});

app.get('/api-perf', (_, response) => {
	const isWin = process.platform === 'win32';
	new Promise<void>(resolve => {
		spawn((isWin ? 'npm.cmd' : 'npm'), ['run', 'perf'], { detached: true });
		resolve();
	});
	response.sendStatus(200);
});

app.get('/api-perf-hash', (_, response) => {
	const isWin = process.platform === 'win32';
	new Promise<void>(resolve => {
		spawn((isWin ? 'npm.cmd' : 'npm'), ['run', 'perf', '--', '--hash'], { detached: true });
		resolve();
	});
	response.sendStatus(200);
});

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

socketServer.on('connection', ws => {
	new Client(ws);
})