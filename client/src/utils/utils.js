let globalSettings = {
    serverAddr: "http://localhost:3015"
}

export default class Utils {
    constructor() {}

    static get GlobalSettings() {
        return globalSettings;
      }
    
}  