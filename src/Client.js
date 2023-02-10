if(typeof window === "undefined"){
    JsonString = require("./JsonString");
    WebSocket = require("ws");
}

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
                let data = toString(msg.data);
                console.log(data)
            };
        }
        /**
         * Attach listener to event
         * @param {string} event 
         * @param {(data:Object<string,any>|Blob)=>void} listener 
         */
        add(event,listener){
            this.addEventListener(event,listener);
        }
        /**
         * Detach listener from event
         * @param {string} event 
         * @param {(data:Object<string,any>|Blob)=>void} listener 
         */
        remove(event,listener){
            this.removeEventListener(event,listener)
        }
    
        /**
         * 
         * @param {string} event 
         * @param {string | Buffer | number | JsonString} data 
         */
        fireServer(event,data){
            if(
                typeof data !== "string"
                && !(data instanceof Uint8Array)
                && !(data instanceof JsonString)
                && typeof data !== "number"
            )
            throw new Error("Invalid data type");
            if(typeof data === "string")
            {
                return this.send(JSON.stringify({type : "string", event : event,data : data}));
            }
            if(typeof data === "number")
            {
                return this.send(JSON.stringify({type : "number", event : event,data : data}));
            }
            if(data instanceof Uint8Array)
            {
                return this.send(JSON.stringify({type : "buffer", event : event,data : data.toString()}));
            }
            if(data instanceof JsonString)
            {
                return this.send(JSON.stringify({type : "json", event : event,data : data.value}));
            }
        }
    }

if(typeof window === "undefined")
    module.exports = Client;