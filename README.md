# ws_api

a simple ws_api that implement an event handler. This api uses WebSocket JS

## Getting started

### Server

__**Only for node js**__

```js
const {Server} = require("ws_api");
const server = new Server({port : 8080});
server.fireAllClients(new Data("event",new JsonString({"foo":"bar"})))
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
<script src="path/to/ws_api/web.js"><script>
<script src="Your/file"><script>
```

In the JS file:

```js
const socket = new Client("ws://localhost:8080");
```

## Data transfer

### Data class

import :

#### For nodejs

```js
const {Data,JsonString} = require("ws_api");
```

### For web

```html
<script src="path/to/ws_api/web.js"><script>
<script src="Your/file"><script>
```

1. Data : This class is holding the information of transfer `new Data(event_name : string,data : string | number | Uint8Array | JsonString)`
2. JsonString : If you don't use this class and use a JSON.stringify, you will have to use JSON.parse on the other side `new JsonString(parsable json data)`

### Sending data

There's 4 functions :


Client Side:

- `fireServer` trigger event in the server

Server Side:

- `fireClient` trigger the event for the client specified
- `fireClients` the same as fireClient but for the provided clients
- `fireAllClients` trigger the event for every client connected

```ts
fireServer(data : Data);
fireClient(client: WebSocket,data : Data);
fireAllClients(data : Data);
fireClients(clients: WebSocket[],data : Data)
```

### Receiving data

#### Server

```ts
server.add("some server event",function(client:WebSocket,data : Data)=>{
    console.log(client,Data.type);
})
```

#### Client

```ts
socket.add("client event",function(data : Data){
    console.log(Data.type);
})
```

## Exemple

A simple hello world

### Client

```js
const socket = new Client("ws://localhost:8080");
socket.add("chat",function(rep){
    if(rep.type === "string")
        console.log(rep.data);
    else
        console.log("Expecting string data but received "+rep.type);
})
socket.onopen = ()=>{
    socket.fireServer(new Data("chat","Hello, I'm World"));
}
```

### Server

```js
const server = new Client({port : 8080});
server.add("chat",function(client,rep){
    if(rep.type !== "string"){
        return console.error("Expecting string data but received "+rep.type);
    }
    console.log(rep.data);
    fireClient(client,new Data("chat","Hello, world !"));
})
```
