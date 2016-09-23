import {ModuleBase} from "../lib/module";


export class PlaylistModule extends ModuleBase {
    constructor(io, usersModule, playlistRepository, videoServices){
        super();
        this._io = io;
        this._users = usersModule;
        this._repository = playlistRepository;
        this._services = videoServices;
        
        this._nextSourceId = 1;
        this._playlist =[];
    }
    
    init$() {                             //equal: playlist =>this.setPlaylist(playlist)
        return this._repository.getAll$().do(this.setPlaylist.bind(this));
    }                                       //have to bind(this) b.c. otherwise this will be Observable
                                            //When using the upper one, it has arrow function to fix this. 
    setPlaylist(playlist){
        this._playlist = playlist;
        
        for(let source of playlist)
            source.id = this._nextSourceId++;
            
        this._io.emit("playlist:list", this._playlist);
    }
    
    registerClient(client) {
        client.onActions({
            "playlist:list": ()=>{
                return this._playlist;
            }
        });
    }
}