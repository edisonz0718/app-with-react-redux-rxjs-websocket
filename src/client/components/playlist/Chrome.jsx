import React , {Component, PropTypes} from "react";

import ScrollArea from "./ScrollArea.jsx";

export default class Chrome extends Component {
    render(){
        const style ={
            top:  `${this.props.percent}%`  
        };
        return (
            <div className="chrome">
                <ScrollArea />
                <div className="playing-indicator" style={style}></div>
            </div>     
        );
    }    
}

Chrome.propTypes = {
    percent : PropTypes.number.isRequired    
};