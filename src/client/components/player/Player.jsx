import "./player.scss";
import React , {Component , PropTypes} from "react";
import moment from "moment";
import YoutubePlayer from "./youtubePlayer/YoutubePlayer.jsx";

export default class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            currentTransition: false,
            bufProgress: 0,
            currentProgress: 0,
            timeInfo : ""
        };
    }    
    componentDidMount(){
        const {playlistStore} = this.props;
        playlistStore.playerEvent$
            .subscribe(({state})=>{
                if(!state.current.source) 
                    return;
                    
               this.setState({title:state.current.source.title}); 
            });
    }
    playersAttached(player) {
        let lastSource = null,
            lastPlayer = null;
        this.props.playlistStore.playerEvent$
            .subscribe(({type,state}) => {
                const curSource = state.current.source;
                const curTime = state.current.time;
                //stop player when no items in the list
                if(!curSource){
                    if(lastSource){
                        lastPlayer.stop();
                        lastPlayer = lastSource = null;
                    }
                    
                    return;
                }
                //const player = this._players[curSource.type];
                //pause player
                if(type == "pause")
                    player.pause();
                
                if(type == "resume")
                    player.resume();
                //play different source  
                if(!lastSource && state.list.length){
                    lastSource = curSource;
                    lastPlayer = player;                   
                    player.cue(curSource, curTime);
                }//init
                else if(curSource != lastSource){
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
        this.props.playlistStore.serverTime$
            .subscribe(current =>{
                if(current.source == null)
                    return;
                let currentTransition;
                if(current.time == 0 || current.opState.jumped)
                    currentTransition = false;
                    //this._$curProgress.removeClass("current-transition");
                else
                    currentTransition = true;
                    //this._$curProgress.addClass("current-transition");                   
                const totaltime = moment.duration(current.source.totaltime, "seconds").format("hh:mm:ss"); 
                const timeInfo =this.addFormat(moment.duration(current.time,"seconds").format("hh:mm:ss"),totaltime)+" / " + this.addFormat(totaltime); 
                this.setState({currentTransition,timeInfo,curProgress:current.progress,bufProgress:player.bufProgress});
                //this._$curProgress.css("width", `${current.progress}%`);
                //this._$bufProgress.css("width",`${this._player.bufProgress}%`);
            });
    }
    addFormat(duration,totaltime){
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
    paused(){
        this.props.playlistStore.pauseSource$()
            .catchWrap()
            .subscribe(result =>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            }); 
    }
    played(){
        this.props.playlistStore.resumeSource$()
            .catchWrap()
            .subscribe(result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
    }
    goPrev(){
        this.props.playlistStore.playPrevious$().catchWrap()
            .subscribe(result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
    }
    goNext(){
        this.props.playlistStore.playNext$().catchWrap()    
            .subscribe(result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
    }
    jumpProgress(e, node){
        const percent = e.nativeEvent.offsetX/node.clientWidth;
        
        this.props.playlistStore.jumpTime$(percent).catchWrap()
            .subscribe(result => {
                if(result && result.error)    
                    alert(result.error.message || "Unknown Error");
            });
    }
    render(){
        return (
            <div>
                <h1>{this.state.title}</h1>
                <div className="players">
                    <YoutubePlayer 
                        handleEvent = {this.playersAttached.bind(this)}
                        played = {this.played.bind(this)}
                        paused = {this.paused.bind(this)}
                        goNext = {this.goNext.bind(this)}
                        goPrev = {this.goPrev.bind(this)}
                        jumpProgress = {this.jumpProgress.bind(this)}
                        {...this.state}
                    />
                </div>     
            </div>
        );
    }
}

Player.propTypes = {
    playlistStore: PropTypes.object.isRequired   
};