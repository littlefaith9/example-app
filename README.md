# example-app
- The example client-server application
> Implement client and server applications.
> Multiple clients can connect to the server and move around in a virtual space. Movement of one client should be visible to all of the connected clients. Assume that at least 500 clients can be connected at once.

## Setting up the project
- Make sure you have NodeJS v18 installed. (Only supported version for this project)

## Running in development
- Make sure you have all including dev dependencies installed using `npm install`
```bash
npm run tsw			# Build server code
npm run cd			# Build client code
npm run sd			# Start dev server
```

## Running in production
- Make sure you have regular dependencies installed using `npm install --omit=dev`
- Build using
```bash
npm run webpack		# Build client code
npm run tsc			# Build server code
```

- Then start server using
```bash
npm start
```

## How to test
- Log in `localhost:8090`
- Enter your name and join game (Max length: 15)
- Run around

## Performance test
- Click either of the two buttons
> `Add 100 clients` is connecting 100 clients to server, `Add 100 hashed clients` is connecting 100 clients with a name of 15 random characters. They both create a new node process. To toggle moving around, enter `/move` in newly spawned processes.

## Changelog

### Example App v0.1.0
- Added donkeys
- Added walking around