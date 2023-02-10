const {Client,Server} = require("./main.js");
const fs = require("fs");
const JsonString = require("./src/JsonString.js");
const server =new Server({"port" : 8080});
const client = new Client("ws://localhost:8080");
client.on("open",async ()=>{
    client.fireServer("Test",new Uint8Array(await (new Blob(new Uint8Array(8)).arrayBuffer())));
})
