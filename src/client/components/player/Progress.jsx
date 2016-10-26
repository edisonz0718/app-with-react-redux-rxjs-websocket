import React , {Component, PropTypes} from "react";

export default class Progress extends Component {

    render(){
        const style={
            width: `${this.props.width}%`
        };
        
        return (
            <span 
                className={"youtube-progress " + this.props.type + (this.props.type === "current" && this.props.currentTransition ?" current-transition":"")}
                style={style}
            >
            </span>     
        );
    }
}

Progress.propTypes = {
    type:               PropTypes.string.isRequired,
    width:              PropTypes.number,
    currentTransition:  PropTypes.bool,
};