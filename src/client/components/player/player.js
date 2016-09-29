import $ from "jquery";
import _ from "lodash";
import {Observable} from "rxjs";
import {ElementComponent}  from "../../lib/component";

import "./player.scss";

import {playlistStore} from "../../services";

import {YoutubePlayer} from "./players/youtube";

class PlayComponent extends ElementComponent {
    constructor(playlistStore) {
        super() ;   
        this._playlist = playlistStore;
        this.$element.addClass("players");
    }
    
    _onAttach() {
        const $title = this._$mount.find("h1");
        
        this._players = {
            youtube: new YoutubePlayer(this._playlist)
        };
        
        for(let type in this._players){
            if(!this._players.hasOwnProperty(type))
                continue;
                
            this._players[type].attach(this.$element);
        }
        
        const initList = _.map(this._players, player =>player.init$());
        Observable.merge(...initList)
            .toArray() // wait all to be finished
            .compSubscribe(this, this._playersAttached.bind(this));
        
        this._playlist.playerEvent$
            .compSubscribe(this,({state}) => {
                if(!state.current.source)
                    return;
                
                $title.text(state.current.source.title);
            });
    }
    
    _playersAttached() {
        let lastSource = null,
            lastPlayer = null;
        this._playlist.playerEvent$
            .compSubscribe(this, ({type,state}) => {
                const curSource = state.current.source;
                const curTime = state.current.time;
                //stop player
                if(!curSource){
                    if(lastSource){
                        lastPlayer.stop();
                        lastPlayer = lastSource = null;
                    }
                    
                    return;
                }
                const player = this._players[curSource.type];
                //pause player
                if(type == "pause")
                    player.pause();
                
                if(type == "resume")
                    player.resume();
                //play different source  
                if(curSource != lastSource){
                    if(lastPlayer && player != lastPlayer){
                        lastPlayer.stop();
                    }
                    
                    lastSource = curSource;
                    lastPlayer = player;
                    player.play(curSource, curTime);
                }
                // sync up to server time if playing
                else if(Math.abs(curTime - player.currentTime ) > 2)
                    player.seek(curTime);
            });
    }
    
}
let component;
try{
    component = new PlayComponent(playlistStore);
    component.attach($("section.player"));
} catch(e){
    console.error(e);
    if(component)
        component.detach();
} finally {
    if(module.hot){
        module.hot.accept();
        module.hot.dispose(()=>component && component.detach());//if reloaded, dispose the old component
    }
}