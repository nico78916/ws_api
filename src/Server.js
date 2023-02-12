const {WebSocketServer,WebSocket} = require("ws");
const Data = require("./Data.js");
class Server extends WebSocketServer {
    /**
     * Create a new client
     * @param {WebSocket.ServerOptions} [options] 
     */
    constructor(options)
    {
        super(options);
        /**
         * @type {Map<string,WebSocket>}
         */
        this.users = new Map();
        super.on("connection",(client,req) => {
            client.on("message",(msg,isBinary) =>{
                if(isBinary){
                    throw Error("You must use fireServer to send data");
                }
                const data = Data.formJson(msg);
                super.emit(data.event,client,data.type,data.data);
            });
        }) 
    }
    /**
     * Attach listener to event
     * @param {string} event 
     * @param {(client:WebSocket,data:Data)=>void} listener
     */
    add(event,listener){
        this.on(event,listener);
    }
    /**
     * Detach listener from event
     * @param {string} event 
     * @param {(client:WebSocket,data:Data)=>void} listener
     */
    remove(event,listener){
        this.off(event,listener)
    }

    /**
     * Trigger event for specified client
     * @param {WebSocket} client 
     * @param {string} event
     */
    fireClient(client,event,data){
        client.send(Data.toJson(event,data));
    }
    /**
     * Trigger event for all clients
     * @param {Data} data 
     */
    fireAllClients(data){
        this.users.forEach((client,k)=>{
            this.fireClient(client,event,data);
        })
    }
}
module.exports = Server;