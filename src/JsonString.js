class JsonString{
    constructor(data){
        this.value = JSON.stringify(data);
    }
}
module.exports = JsonString