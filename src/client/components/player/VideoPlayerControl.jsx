import React , {Component, PropTypes} from "react";

import Time from "./Time.jsx";
import Button from "./Button.jsx";

export default class VideoPlayerControl extends Component {
    render(){
        const {timeInfo,fullscreen,playing,pause,resume,handleFullscreen,goPrev,goNext} = this.props;
        return (
            <div className="main-control">
                <div className="control-group">
                    <Button 
                        type="prev-btn" 
                        icon="fa fa-backward" 
                        onClick={goPrev}
                    /> 
                    <Button 
                        type={playing?"pause-btn":"play-btn"} 
                        icon={playing?"fa fa-pause":"fa fa-play"}
                        onClick={playing?pause: resume} 
                    />                    
                    <Button 
                        type="next-btn" 
                        icon="fa fa-forward"
                        onClick= {goNext}
                    />                     
                    <Time timeInfo = {timeInfo}/>
                </div>
                <Button 
                    type={fullscreen?"exit-fullscreen-btn":"fullscreen-btn"} 
                    icon={fullscreen?"fa fa-compress" : "fa fa-expand"} 
                    onClick ={handleFullscreen}
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