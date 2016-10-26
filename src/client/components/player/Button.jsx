import React , {Component, PropTypes} from "react";

export default class Button extends Component{
    handleClick(e){
        if(this.props.type === "play-btn")
            this.props.resume();    
        else if(this.props.type === "pause-btn")
            this.props.pause();
        else if(this.props.type ==="fullscreen-btn"||this.props.type ==="exit-fullscreen-btn")
            this.props.handleFullscreen();
        else if(this.props.type ==="prev-btn")
            this.props.goPrev(); 
        else if(this.props.type ==="next-btn")
            this.props.goNext();
    }
    render(){
        const {type} = this.props;
        let text = "";
        let icon = null;
        if(type === "play-btn")
            icon = "fa fa-play"; 
        else if(type === "pause-btn")       
            icon = "fa fa-pause";        
        else if(type === "next-btn")
            icon = "fa fa-forward";               
        else if(type === "prev-btn")
            icon = "fa fa-backward";               
        else if(type === "fullscreen-btn")       
            icon = "fa fa-expand";       
        else if(type === "exit-fullscreen-btn")              
            icon = "fa fa-compress";       
        else if(type === "add-button")
            icon = "fa fa-plus-square";
        if(this.props.text)
            text = this.props.text;
            
        
        return (
            <a href="#" onClick={this.handleClick.bind(this)} className={type}>
                <i className={icon} aria-hidden="true"></i>{text}
            </a>         
        );    
    }    
}

Button.propTypes = {
    type : PropTypes.string.isRequired,
    text : PropTypes.string
};