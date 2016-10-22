import {Observable} from "rxjs";
import $ from "jquery";
import moment from "moment";

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
        
        //clickable progress bar: current-progress,  buffered-progress
        this._$progress = $(`<div class="progress" />`);
        this._$curProgress = $(`<span class="youtube-progress current current-transition"/>`);
        this._$bufProgress = $(`<span class="youtube-progress buffered"/>`);
        this._$progress.append([
            $(`<span class="youtube-progress total" />`), 
            this._$curProgress,
            this._$bufProgress]);
        //pause/resume button: call player's methods when clicked
        this._$control = $(`<div class="main-control" />`);
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
        this._$control.append([
            this._$leftControl,
            this._$fullscreenBtn
        ]); 
        this.$element.append([
            this._$progress,
            this._$control
        ]);
    } 
    
    _onAttach(){
       
        const $icon = this._$fullscreenBtn.find("i");
        //const $playIcon  = this._$playBtn.find("i");

        //console.log($youtube);
        
        Observable.fromEventNoDefault(this._$fullscreenBtn, "click")        
            .do(()=>{
                const $youtube = document.querySelector(".youtube");
                if(document.webkitFullscreenElement)
                    document.webkitExitFullscreen();                   
                else
                    $youtube.webkitRequestFullscreen();                   
            }).subscribe();
        //listen to the full screen change    
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

        Observable.fromEventNoDefault(this._$playBtn, "click")
            .do(()=>{
                const playerState = this._player.playerState;
                console.log(playerState);
                if(playerState != 1)
                    this._player.resume();
                else
                    this._player.pause();
            }).subscribe();
        
        Observable.fromEventNoDefault(this._$prevBtn,"click")
            .mergeMap(()=>this._playlist.playPrevious$().catchWrap())
            .compSubscribe(this,result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error"); 
            });
            
        Observable.fromEventNoDefault(this._$nextBtn,"click")
            .mergeMap(()=>this._playlist.playNext$().catchWrap())
            .compSubscribe(this,result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error"); 
            });           
        
        Observable.fromEventNoDefault(this._$progress, "click")
            .map(e =>e.offsetX/this._$progress[0].clientWidth)
            .mergeMap(percent => this._playlist.jumpTime$(percent).catchWrap())
            .compSubscribe(this, result => {
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
        
//        Observable.fromEvent(this._$progress, "hover")
//            .map
            
            
        this._playlist.serverTime$
            .compSubscribe(this, current=>{
                if(current.source == null)
                    return;
                if(current.time == 0 || current.opState.jumped)
                    this._$curProgress.removeClass("current-transition");
                else
                    this._$curProgress.addClass("current-transition");                   
                const totaltime = moment.duration(current.source.totaltime, "seconds").format("hh:mm:ss"); 
                this._$curProgress.css("width", `${current.progress}%`);
                this._$timeInfo.text(addFormat(moment.duration(current.time,"seconds").format("hh:mm:ss"),totaltime)+" / " + addFormat(totaltime));
                this._$bufProgress.css("width",`${this._player.bufProgress}%`); 
            });
            
    }
    

    

    
    
}
function addFormat(duration,totaltime){
    if(duration.search(/:/) == -1)
        return `0:${duration}`;
    else if(totaltime && duration>totaltime){
        if(totaltime.search(/:/) == -1)
            totaltime = `0:${totaltime}`;
        return totaltime;
    } else {
        return duration;
    }
            
}