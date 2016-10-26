import React , {Component, PropTypes} from "react";

import ProgressBars from "../ProgressBars.jsx";
import VideoPlayerControl from "../VideoPlayerControl.jsx";

export default class YoutubeControl extends Component{
    render(){
        return (
            <div className="youtube-control">
                <ProgressBars {...this.props}/>
                <VideoPlayerControl {...this.props}/>
            </div>         
        );
    } 
}

YoutubeControl.propTypes = {
        
};