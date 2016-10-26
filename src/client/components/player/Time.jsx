import React , {Component, PropTypes} from "react";

export default class Time extends Component {
    render(){
        return (
            <time className="time-info">{this.props.timeInfo}</time>     
        );
    }    
}

Time.propTypes = {
    timeInfo: PropTypes.string.isRequired    
};