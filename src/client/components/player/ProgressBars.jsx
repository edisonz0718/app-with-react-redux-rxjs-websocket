import React , {Component, PropTypes} from "react";
import Progress from "./Progress.jsx";

export default class ProgressBars extends Component {
    jumpProgress(e){
        this.props.jumpProgress(e,this.node);
    }
    render(){
        return (
            <div className="progress" 
                onClick={this.jumpProgress.bind(this)}
                ref ={node=> this.node = node}
            >
                <Progress type="youtube-progress total"/>         
                <Progress type="youtube-progress current" 
                    width={this.props.curProgress} 
                    currentTransition={this.props.currentTransition}
                />                    
                <Progress type="youtube-progress buffered" width={this.props.bufProgress}/>                     
            </div>
        );
    }    
}

ProgressBars.propTypes = {
    jumpProgress: PropTypes.func.isRequired            
};