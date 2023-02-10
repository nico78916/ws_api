const {WebSocketServer,ServerOptions, WebSocket} = require("ws");
const DataFormater = require("./DataFormater");

class Server extends WebSocketServer {
    /**
     * Create a new client
     * @param {ServerOptions} [options] 
     */
    constructor(options)
    {
        super(options);
        /**
         * @type {Map<string,WebSocket>}
         */
        this.users = new Map();
        super.on("connection",(client,req) => {
            console.log(req.url);
            this.users.set("a",client);
            client.on("message",(msg,isBinary) =>{
                if(isBinary){
                    throw Error("You must use fireServer to send data");
                }
                const data = DataFormater.formJson(msg);
                super.emit(data.event,client,data.type,data.data);
            });
            console.log(this.users);
        }) 
    }
    /**
     * Attach listener to event
     * @param {string} event 
     * @param {(client:WebSocket,type:string,data:Object<string,any>|Buffer)=>void} listener 
     */
    add(event,listener){
        this.on(event,listener);
    }
    /**
     * Detach listener from event
     * @param {string} event 
     * @param {(client:WebSocket,type:string,data:Object<string,any>|Buffer)=>void} listener
     */
    remove(event,listener){
        this.off(event,listener)
    }

    /**
     * Trigger event for specified client
     * @param {WebSocket} client 
     * @param {string} event 
     * @param {number | string | Uint8Array | JsonString} data 
     */
    fireClient(client,event,data){
        client.send(DataFormater.toJson(event,data));
    }
    /**
     * Trigger event for all clients
     * @param {string} event 
     * @param {number | string | Uint8Array | JsonString} data 
     */
    fireAllClients(event,data){
        this.users.forEach((client,k)=>{
            this.fireClient(client,event,data);
        })
    }
}
module.exports = Server;