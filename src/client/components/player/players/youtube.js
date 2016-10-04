import {Observable} from "rxjs";
import $ from "jquery";

import {ElementComponent} from "../../../lib/component";

export class YoutubePlayer extends ElementComponent {
    get currentTime() {
        return  this._player.getCurrentTime();
    }
    
    constructor(playlistStore){
        super(); 
        this._playlist = playlistStore;
    }
    
    _onAttach(){
        this.$element.addClass("player youtube");
    }
    
    init$() {
        this.$element.hide();
        const $playerElement = $(`<div />`).appendTo(this.$element);//required by youtube iframe api
        return new Observable(observer =>{
            window.onYouTubeIframeAPIReady = () => {
                this._player = new window.YT.Player($playerElement[0], {
                    width: "100%",
                    height: "100%",
                    videoId: "",
                    playerVars: {
                        autohide: 1,
                        disablekb: 1,
                        enablejsapi: 1,
                        modestbranding: 1,
                        iv_load_policy: 3,
                        //controls:0,
                        rel: 0
                    },
                    events: {
                        onReady: () => {
                            observer.complete();
                        },
                        onStateChange: e =>{
                            if(e.data == window.YT.PlayerState.PAUSED) 
                                this.paused();
                            else if(e.data == window.YT.PlayerState.PLAYING)
                                this.played();
                            else if(e.data == window.YT.PlayerState.ENDED)
                                console.log("IT'S ENDED");
                            else if(e.data == window.YT.PlayerState.BUFFERING)
                                console.log("IT'S BUFFERING");                               
                            else if(e.data == window.YT.PlayerState.CUED)
                                console.log("IT'S CUED");                                                              
                        }
                    }
                });
            };
            
            $(`<script src="https://www.youtube.com/iframe_api" />`).appendTo($("body"));
        });
    }
    
    play(source, time){
        this.$element.show();
        this._player.loadVideoById(source.url, time);
    }
    
    stop() {
        this.$element.hide();
        this._player.pauseVideo();
    }
    pause(){
        this._player.pauseVideo();       
    }
    resume(){
        this._player.playVideo();
    }
    
    seek(time) {
        this._player.seekTo(time);
    }
    paused(){
        this._playlist.pauseSource$()
            .catchWrap()
            .compSubscribe(this, result =>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            }); 
    }
    played(){
        this._playlist.resumeSource$()
            .catchWrap()
            .compSubscribe(this, result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
    }
}