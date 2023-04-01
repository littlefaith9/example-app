import express from 'express';
import { WebSocketServer } from '../../cws';
import { ServerMap } from './map';
import { Client } from './socket';
import { pathTo } from './utils';

const PORT = 8090;
const WS_PORT = 8091;
const app = express();
const socketServer = new WebSocketServer({ port: WS_PORT }, () => console.log('WebSocket Server listening on port: ' + WS_PORT));
export const map = new ServerMap();

app.use('/assets/', express.static(pathTo('assets')));
app.use('/', express.static(pathTo('public')));

app.post('/api-join', (request, response) => {
	response.send(`${WS_PORT},${map.assignId(request.body)}`);
})

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

socketServer.on('connection', ws => {
	new Client(ws);
})