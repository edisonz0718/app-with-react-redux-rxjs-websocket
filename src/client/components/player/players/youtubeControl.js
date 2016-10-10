import {Observable} from "rxjs";
import $ from "jquery";

import {ElementComponent} from "../../../lib/component";


export class YoutubeControl extends ElementComponent{
    
    get $playBtn(){
        return this._$playBtn;
    }
   
    constructor(playlistStore, youtubePlayer){
        super();
        this._player = youtubePlayer;
        this._playlist = playlistStore;
        
        this.$element.addClass("youtube-control");
        //this._$controlScreen = $(`<div class="control-screen" />`); 
        //this._$controlBar= $(`<div class="control-bar" />`);
        
        //clickable progress bar: current-progress,  buffered-progress
        this._$progress = $(`<div class="progress" />`);
        this._$curProgress = $(`<span class="youtube-progress current"/>`);
        this._$bufProgress = $(`<span class="youtube-progress buffered"/>`);
        this._$progress.append([
            $(`<span class="youtube-progress total" />`), 
            this._$curProgress,
            this._$bufProgress]);
        //pause/resume button: call player's methods when clicked
        this._$leftControl = $(`<div class="control-group"/>`);
        this._$playBtn = $(`<a href="#" class="play-btn"/>`).append($(`<i class="fa fa-play" aria-hidden="true"/>`));
        //this._$pauseBtn = $(`<button class="pause-btn"/>`).append($(`<i class="fa fa-pause" aria-hidden="true"/>`));
        //played time/ total time
        this._$timeInfo = $(`<time class="time-info"/>`);
        //next/previous button: call playlistStore play next/previous methods(haven't created)
        this._$prevBtn = $(`<a href="#" class="prev-btn"/>`).append($(`<i class="fa fa-backward" aria-hidden="true"/>`));
        this._$nextBtn = $(`<a href="#" class="next-btn"/>`).append($(`<i class="fa fa-forward" aria-hidden="true"/>`));
        this._$leftControl.append([
            this._$prevBtn,
            this._$playBtn,
            this._$nextBtn,
            this._$timeInfo
        ]);
        //full screen button
        this._$fullscreenBtn = $(`<a href="#" class="fullscreen-btn"/>`).append($(`<i class="fa fa-expand" aria-hidden="true"/>`)); 
        //this._$compressBtn = $(`<button class="compress-btn"/>`).append($(`<i class="fa fa-compress" aria-hidden="true"/>`));        
        
        this.$element.append([
            this._$progress,
            this._$leftControl,
            this._$fullscreenBtn
        ]);
        /*
        this.$element.append([
            this._$controlScreen,
            this._$controlBar
        ]);
        */
    } 
    
    _onAttach(){
       
        const $icon = this._$fullscreenBtn.find("i");
        //const $playIcon  = this._$playBtn.find("i");

        //console.log($youtube);
        
        Observable.fromEventNoDefault(this._$fullscreenBtn, "click")        
            .do(()=>{
                const $youtube = document.querySelector(".youtube");
                if(document.webkitFullscreenElement){
                    document.webkitExitFullscreen();                   
                    /*
                    if(!document.webkitFullscreenElement){
                        $icon.removeClass("fa-compress");
                        $icon.addClass("fa-expand");                   
                    }
                    */
                }
                else{
                    $youtube.webkitRequestFullscreen();                   
                    /*
                    if(document.webkitFullscreenElement){
                        $icon.removeClass("fa-expand");
                        $icon.addClass("fa-compress");
                    }
                    */
                }

            }).subscribe();
            
        document.addEventListener("webkitfullscreenchange",()=>{
            console.log("HELLO");
            if(!document.webkitFullscreenElement){
                $icon.removeClass("fa-compress");
                $icon.addClass("fa-expand");    
            }else{
                $icon.removeClass("fa-expand");
                $icon.addClass("fa-compress");    
            }               
        });            


/*
        $("document").keyup(e=>{
            console.log(e.keyCode);
            if(e.keyCode === 27){
                $icon.removeClass("fa-compress");
                $icon.addClass("fa-expand");                   
            }
        });
*/           

        Observable.fromEventNoDefault(this._$playBtn, "click")
            .do(()=>{
                const playerState = this._player.playerState;
                console.log(playerState);
                if(playerState != 1){
                    this._player.resume();
                    //$playIcon.addClass("fa-play");
                    //$playIcon.removeClass("fa-pause");
                }else{
                    this._player.pause();
                    //$playIcon.addClass("fa-pause");
                    //$playIcon.removeClass("fa-play");                   
                }
            }).subscribe();
    }
    

    
    
}