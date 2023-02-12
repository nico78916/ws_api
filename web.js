class JsonString{
    constructor(data){
        this.value = JSON.stringify(data);
    }
}

class Data {
    constructor(event,data,type = undefined){
        /**
         * @type {'json'|'string'|'buffer'|'number'}
         */
        this.type = type;
        /**
         * @type {number | string | Uint8Array | JsonString | Object<string,any>}
         */
        this.data = data;

        /**
         * @type {string}
         */
        this.event = event;

    }
    /**
     * 
     * @return {string}
     */
    toJson(){
        let data = this.data;
        if(
            typeof data !== "string"
            && !(data instanceof Uint8Array)
            && !(data instanceof JsonString)
            && typeof data !== "number"
            && typeof data !== "undefined"
        )
        throw new Error("Invalid data type : "+(typeof data === "object" ? data.constructor.name : typeof data)+ " provided instead of number | string | Uint8Array | JsonString");
        let type = "";
        let f_data = data;
        type = typeof data === "string" ? "string" : (typeof data === "number" ? "number" : "");
        if(data instanceof Uint8Array)
        {
            type = "buffer"
            f_data = data.toString();
        }else
        if(data instanceof JsonString)
        {
            type = "json";
            f_data = data.value;
        }
        if(data === undefined){
            return JSON.stringify({type:type,event:this.event});
        }
        return JSON.stringify({type:type,event:this.event,data:f_data});
    }
    /**
     * 
     * @param {RawData} raw 
     * @return {Data}
     */
    static formJson(raw){
        /**
         * @type {{type : 'json'|'string'|'buffer'|'number', event:string, data: number | string | Uint8Array}}
        */
        let json = JSON.parse(raw.toString());
        switch(json.type){
            case "json":
                json.data = JSON.parse(data.data);
                break;
            case "buffer":
                json.data = Uint8Array.from(data.data);
        }
        return new Data(json.event,json.data,json.type);
    }
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
        this.addEventListener(event,listener);
    }
    /**
     * Detach listener from event
     * @param {string} event 
     * @param {(data : Data)=>void} listener 
    */
    remove(event,listener){
        this.removeEventListener(event,listener)
    }
    
    /**
     * trigger the server
     * @param {Data} data
    */
    fireServer(data){
        return this.send(data.toJson());
    }
}