const {DataFormater} = require("./DataFormater.js");
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
            let data = DataFormater.formJson(msg.data)
            emit(data.event,data.type,data.data);
        };
    }
    /**
     * Attach listener to event
     * @param {string} event 
     * @param {(data:DataFormater)=>void} listener 
    */
    add(event,listener){
        this.on(event,listener);
    }
    /**
     * Detach listener from event
     * @param {string} event 
     * @param {(data : DataFormater)=>void} listener 
    */
    remove(event,listener){
        this.off(event,listener)
    }
    
    /**
     * trigger the server
     * @param {DataFormater} data
    */
    fireServer(data){
        return this.send(data.toJson());
    }
}
module.exports = Client;