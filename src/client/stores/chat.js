import {Observable} from "rxjs";

import {validateSendMessage} from "shared/validation/chat";


export class ChatStore {
    constructor(server, userStore){
        this._server = server;
        this._users = userStore;
        
        this.message$ = Observable.merge(
            server.on$("chat:list").mergeMap(list=>Observable.from(list)),
            server.on$("chat:added"))
            .publishReplay(100);
            
        this.message$.connect();
        
        server.on$("connect")
            .first()
            .subscribe(()=>server.emit("chat:list"));
    } 
    
    sendMessage$(message, type="normal"){
        const validator = validateSendMessage(this._users.currentUser, message, type);
        if(!validator.isValid)     
            return Observable.throw({message: validator.message});
        
        return this._server.emitAction$("chat:add", {message, type});
        
    }
}