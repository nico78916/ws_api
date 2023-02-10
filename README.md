# ws_api

a simple ws_api that implement an event handler. This api uses WebSocket JS

## Getting started

### Server

**Only for node js :**

```js
const {Server} = require("ws_api");
const server = new Server({port : 8080});
server.add("event_name",(client,data)=>{
    console.log("User :",client,"sent",data);
});
```

### Client

#### Node js

```js
const {Client,JsonString} = require("ws_api");
const socket = new Client("ws://localhost:8080");
socket.fireServer("event_name",JsonString({"test" : "test"}));
socket.fireServer("event_name","test");
socket.fireServer("event_name",69);
socket.fireServer("event_name",new Uint8Array(new Buffer()));
```

#### Web

In html :

```html
<script src="path/to/Client.js"><script>
<script src="Your/file"><script>
```

In the JS file:

```js
const socket = new Client("ws://localhost:8080");
socket.fireServer("event_name",JsonString({"test" : "test"}));
socket.fireServer("event_name","test");
socket.fireServer("event_name",69);
socket.fireServer("event_name",new Uint8Array(new Blob()));
```

## Data transfer

There's 4 functions :

```ts
fireServer(event: string,data: string | number | Uint8Array | JsonString);
fireClient(client: WebSocket,event: string,data: string | number | Uint8Array | JsonString);
fireAllClients(event,data);
fireClients(clients_id: WebSocket[],event: string,data: string | number | Uint8Array | JsonString)
```

Client Side:

- `fireServer` trigger event in the server

Server Side:

- `fireClient` trigger the event for the client specified
- `fireClients` the same as fireClient but for the provided clients
- `fireAllClients` trigger the event for every client connected
