import {Observable} from "rxjs";
import $ from "jquery";

import "./youtube.scss";

import {ElementComponent} from "../../../lib/component";

import {YoutubeControl} from "./youtubeControl";

export class YoutubePlayer extends ElementComponent {
    get currentTime() {
        return  this._player.getCurrentTime();
    }
    get playerState(){
        return this._player.getPlayerState();
    }
    get bufProgress(){
        if(this._ready)
            return this._player.getVideoLoadedFraction()*100;
        else
            return 0;
    }
    
    constructor(playlistStore){
        super(); 
        this._ready = false;
        this._playlist = playlistStore;
    }
    
    _onAttach(){
        this.$element.addClass("player youtube");
        
        this.youtubeControl = new YoutubeControl(this._playlist, this);
        this.youtubeControl.attach(this.$element);
        this.children.push(this.youtubeControl);
        
    }
    
    init$() {
        this.$element.hide();
        const $playerElement = $(`<div id="myplayer"/>`).appendTo(this.$element);//required by youtube iframe api
        const $playIcon = this.youtubeControl.$playBtn.find("i"); 
        return new Observable(observer =>{
            window.onYouTubeIframeAPIReady = () => {
                this._player = new window.YT.Player($playerElement[0], {
                    width: "100%",
                    height: "100%",
                    videoId: "",
                    playerVars: {
                        controls: 0,
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
                            this._ready = true;
                            observer.complete();

                        },
                        onStateChange: e =>{
                            if(e.data == window.YT.PlayerState.PAUSED){ 
                                this.paused();
                                //console.log("IT'S PAUSED");                                                              
                                $playIcon.addClass("fa-play");
                                $playIcon.removeClass("fa-pause");  
                                //document.querySelector(".youtube").webkitRequestFullscreen();
                            }
                            else if(e.data == window.YT.PlayerState.PLAYING){
                                this.played();
                                //console.log("IT'S PLAYING");                               
                                $playIcon.addClass("fa-pause");
                                $playIcon.removeClass("fa-play");  
                            }
                            /*
                            else if(e.data == window.YT.PlayerState.ENDED)
                                console.log("IT'S ENDED");
                            else if(e.data == window.YT.PlayerState.BUFFERING)
                                console.log("IT'S BUFFERING");                               
                            else if(e.data == window.YT.PlayerState.CUED)
                                console.log("IT'S CUED");                                                              
                            */
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
    cue(source, time){
        this.$element.show();
        this._player.cueVideoById(source.url, time);
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