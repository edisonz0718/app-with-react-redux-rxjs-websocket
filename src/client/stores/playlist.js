import {Observable} from "rxjs";

import {validateAddSource} from "shared/validation/playlist";

export class PlaylistStore {
    constructor(server) {
        const defaultState = {
            current: null, // current item
            list:[], // list of source objects
            map:{} // id maps to source object i think
        };
        
        this._server = server;
        
        const events$ = Observable.merge(
            server.on$("playlist:list").map(opList),
            server.on$("playlist:added").map(opAdd),
            server.on$("playlist:current").map(opCurrent),
            server.on$("playlist:removed").map(opRemove),
            server.on$("playlist:moved").map(opMove),
            server.on$("player:pause").map(opPause),
            server.on$("player:resume").map(opResume));
            
        this.actions$ = events$
            .scan(({state},op) =>op(state), {state:defaultState})
            .publish();
            
        this.state$ = this.actions$
            .startWith({state:defaultState})
            .publishReplay(1);
            
        this.serverTime$ = this.actions$
            .filter(a => a.type == "current")
            .map(a => a.state.current)
            .publishReplay(1);
            
        this.playerEvent$ = this.actions$
            .filter(a => a.type == "current" || a.type == "pause" || a.type =="resume")
            .publishReplay(1);           
        
        this.actions$.connect(); 
        this.state$.connect();
        this.serverTime$.connect();
        this.playerEvent$.connect();
            
        server.on("connect", () =>{
            server.emitAction$("playlist:list")
                .subscribe(()=>{
                    server.emit("playlist:current");
                });
        });
    }
    
    addSource$(url){
        const validator = validateAddSource(url);
        if(!validator.isValid)
            return Observable.throw({message:validator.message});
            
        return this._server.emitAction$("playlist:add", {url});
    }
    
    setCurrentSource$(source) {
        return this._server.emitAction$("playlist:set-current",{id: source.id});
    }
    
    deleteSource$(source){
        return this._server.emitAction$("playlist:remove", {id: source.id});
    }
    
    moveSource$(fromId , toId){
        if(fromId == toId)
            return Observable.empty();
        
        return this._server.emitAction$("playlist:move", {fromId, toId});
    }
    
    pauseSource$(){
        return this._server.emitAction$("player:paused", null); 
    }
    
    resumeSource$(){
        return this._server.emitAction$("player:resumed", null);
    }
}

function opList(sources){
    return state=>{
        state.current = null;
        state.list = sources;
        state.map = sources.reduce((map, source) => {
            map[source.id] = source;
            return map;
        }, {});
        
        return {
            type: "list",
            state: state
        };
    };
    
}

function opAdd({source,afterId}){
    return state => {
        let insertIndex = 0,
            addAfter =null;
            
        if(afterId !== -1){
            addAfter = state.map[afterId];
            if(!addAfter)
                return opError(state, `Could not add source ${source.title} after ${afterId}, as ${afterId} was not found`);
            const afterIndex = state.list.indexOf(addAfter);
            insertIndex = afterIndex + 1;
        }
        
        state.list.splice(insertIndex, 0 , source);
        state.map[source.id] = source;
        return {
            type: "add",
            source: source,
            addAfter: addAfter,
            state: state
        };
    };
}

function opCurrent({id, time}){
    return state => {
        if(id == null){
            state.current = {source : null, time: 0 , progress: 0};
        } else {
             
            const source = state.map[id];
            if(!source)
                return opError(state, `Cannot find item with id ${id}`);
                
            if(!state.current || state.current.source != source){
                state.current = {
                    source : source,
                    time : time,
                    progress : calculateProgress(time,source)
                };
            } else {
                state.current.time = time;
                state.current.progress = calculateProgress(time,source);
            }
        } 
        return {
            type: "current",
            state : state
        };
        
    };
}

function opRemove({id}){
    return state => {
        const source = state.map[id];
        if(!source)
            return opError(state, `Could not remove source with id ${id}, as it was not found`);
        
        const index = state.list.indexOf(source);
        //remove from  both list and map
        state.list.splice(index, 1); 
        delete state.map[id];
        
        return {
            type: "remove",
            source: source,
            state: state
        };
    };
}

function opMove({fromId, toId}){
    return state => {
        const fromSource = state.map[fromId];   
        if(!fromSource)
            return opError(state, `Could not move source, from item ${fromId} not found`);
            
        let toSource = null;
        if(toId) {
            toSource = state.map[toId];
            if(!toSource)
                return opError(state, `Could not move source, to item ${toId} not found`);
        }
        
        const fromIndex = state.list.indexOf(fromSource);
        state.list.splice(fromIndex, 1);
        
        const toIndex = toSource ? state.list.indexOf(toSource) + 1: 0;
        state.list.splice(toIndex, 0, fromSource);
        return {
            type: "move",
            fromSource: fromSource,
            toSource: toSource,
            state: state
        };
    };
}

function opPause() {
    return state =>{
        if(!state.current.source)
            return opError(state, `No current source to be paused`); 
        return {
            type: "pause",
            state: state
        };       
    };

}


function opResume() {
    return state =>{
        if(!state.current.source)
            return opError(state, `No current source to be resumed`); 
        return {
            type: "resume",
            state: state
        };       
    };

}

function opError(state, error) {
    console.error(error);
    return {
        type: "error",
        error: error,
        state: state
    };
}

function calculateProgress(time, source){
    return Math.floor(Math.min(time / source.totalTime, 1) * 100);
}