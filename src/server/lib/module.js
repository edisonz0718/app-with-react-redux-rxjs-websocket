import {Observable} from "rxjs";
/*eslint no-unused-vars: "off"*/

export class ModuleBase {
    init$() {
        return Observable.empty();
    }
    
    registerClient(client){
        this._clientList.push(client);
    }
    
    clientRegistered(client){
        
    }
    
}