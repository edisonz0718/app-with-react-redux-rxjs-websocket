import React , {Component, PropTypes} from "react";

import Time from "./Time.jsx";
import Button from "./Button.jsx";

export default class VideoPlayerControl extends Component {
    render(){
        const {timeInfo,fullscreen,playing,pause,resume,handleFullscreen} = this.props;
        return (
            <div className="main-control">
                <div className="control-group">
                    <Button type="prev-btn" goPrev={this.props.goPrev}/> 
                    <Button type={playing?"pause-btn":"play-btn"} playing={playing} pause={pause} resume={resume}/>                    
                    <Button type="next-btn" goNext= {this.props.goNext}/>                     
                    <Time timeInfo = {timeInfo}/>
                </div>
                <Button 
                    type={fullscreen?"exit-fullscreen-btn":"fullscreen-btn"} 
                    fullscreen={fullscreen}
                    handleFullscreen ={handleFullscreen}
                />
            </div>     
        );
    }    
}

VideoPlayerControl.propTypes = {
    timeInfo:           PropTypes.string.isRequired,    
    fullscreen:         PropTypes.bool.isRequired,
    playing:            PropTypes.bool.isRequired,
    pause:              PropTypes.func.isRequired,
    resume:             PropTypes.func.isRequired,   
    handleFullscreen:   PropTypes.func.isRequired,
    goPrev:             PropTypes.func.isRequired,
    goNext:             PropTypes.func.isRequired
};