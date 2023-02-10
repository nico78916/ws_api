class DataFormater{
    /**
     * 
     * @param {string} event 
     * @param {number | string | Uint8Array | JsonString} data 
     * @return {string}
     */
    static toJson(event,data){
        if(
            typeof data !== "string"
            && !(data instanceof Uint8Array)
            && !(data instanceof JsonString)
            && typeof data !== "number"
        )
        throw new Error("Invalid data type");
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
        return JSON.stringify({type:type,event:event,data:f_data});
    }
    /**
     * 
     * @param {RawData} raw 
     * @return {{type : 'json'|'string'|'buffer'|'number', event:string, data: number | string | Uint8Array | Object<string,any>}}
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
        return json;
    }
}
if(typeof window === "undefined")
module.exports = DataFormater;