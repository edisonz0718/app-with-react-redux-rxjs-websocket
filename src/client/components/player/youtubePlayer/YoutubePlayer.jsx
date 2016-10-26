import "./youtube.scss";

import React , {Component, PropTypes} from "react";

import YoutubeControl from "./YoutubeControl.jsx";

export default class YoutubePlayer extends Component {
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
    constructor(props){
        super(props);
        this._ready = false;
        this.state={
            fullscreen : false,
            playing: false 
        };
    }
    componentDidMount(){
        window.onYouTubeIframeAPIReady = () =>{
            this._player =  new window.YT.Player(this.node,{
                width:"100%",
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
                        this.props.handleEvent(this);
                        this._ready = true;
                        document.addEventListener("webkitfullscreenchange",()=>{
                            if(!document.webkitFullscreenElement)
                                this.setState({fullscreen : false});
                            else
                                 this.setState({fullscreen : true});                               
                        });
                    },
                    onStateChange: e =>{
                        if(e.data == window.YT.PlayerState.PAUSED){ 
                            this.props.paused();
                            this.setState({playing:false});                           
                            //console.log("IT'S PAUSED");                                                              
                            //$playIcon.addClass("fa-play");
                            //$playIcon.removeClass("fa-pause");  
                            //document.querySelector(".youtube").webkitRequestFullscreen();
                        }
                        else if(e.data == window.YT.PlayerState.PLAYING){
                            this.props.played();
                            this.setState({playing:true});
                            //console.log("IT'S PLAYING");                               
                            //$playIcon.addClass("fa-pause");
                            //$playIcon.removeClass("fa-play");  
                        }
                        
                        else if(e.data == window.YT.PlayerState.ENDED){
                            this.setState({playing:false});                                                      
                            //console.log("IT'S ENDED");
                        }
                        else if(e.data == window.YT.PlayerState.BUFFERING){
                            this.setState({playing:false});                                                      
                            //console.log("IT'S BUFFERING");                               
                        }
                        else if(e.data == window.YT.PlayerState.CUED){
                            this.setState({playing:false});                                                      
                            //console.log("IT'S CUED");                                                              
                        }
                        
                    }
                }
            }); 
        };   
        //$(`<script src="https://www.youtube.com/iframe_api" />`).appendTo($("body"));
        const tag = document.createElement("script");
        const firstScriptTag = document.getElementsByTagName("script")[0];
        tag.src = "https://www.youtube.com/iframe_api";
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
    }
    play(source, time){
        //this.$element.show();
        this._player.loadVideoById(source.url, time);
    }
    cue(source, time){
        //this.$element.show();
        this._player.cueVideoById(source.url, time);
    }
    
    stop() {
        //this.$element.hide();
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
    handleFullscreen(){
        const youtube = document.querySelector(".youtube");
        if(document.webkitFullscreenElement)
            document.webkitExitFullscreen();                   
        else
            youtube.webkitRequestFullscreen();    
    }

    render(){
         
        return (
            <div className="player youtube" >     
                <YoutubeControl 
                    {...this.props} 
                    {...this.state}                    
                    pause={this.pause.bind(this)}
                    resume={this.resume.bind(this)}
                    handleFullscreen = {this.handleFullscreen.bind(this)}
                />
                <div id="myplayer" ref={node => this.node = node}></div>
            </div>
        );
    } 
}

YoutubePlayer.propTypes = {
    handleEvent: PropTypes.func.isRequired,
    played: PropTypes.func.isRequired,
    paused: PropTypes.func.isRequired, 
    jumpProgress : PropTypes.func.isRequired
};