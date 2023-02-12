const {Data} = require("./Data.js");
const {WebSocket} = require("ws");
class Client extends WebSocket {
    /**
     * Create a new client
     * @param {string | URL} address 
     * @param {string | string[] | undefined} [protocols] 
     * @param {any} [options] 
    */
    constructor(address,protocols,options)
    {
        super(address,protocols,options);
        super.onmessage = (msg) =>{
            let data = Data.formJson(msg.data)
            emit(data.event,data.type,data.data);
        };
    }
    /**
     * Attach listener to event
     * @param {string} event 
     * @param {(data:Data)=>void} listener 
    */
    add(event,listener){
        this.on(event,listener);
    }
    /**
     * Detach listener from event
     * @param {string} event 
     * @param {(data : Data)=>void} listener 
    */
    remove(event,listener){
        this.off(event,listener)
    }
    
    /**
     * trigger the server
     * @param {Data} data
    */
    fireServer(data){
        return this.send(data.toJson());
    }
}
module.exports = Client;