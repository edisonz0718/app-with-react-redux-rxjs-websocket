import React , {Component, PropTypes} from "react";

export default class Button extends Component{

    render(){
        const {type,icon,onClick} = this.props;
        let text = "";
  
        if(this.props.text)
            text = this.props.text;
            
        
        return (
            <a href="#" onClick={onClick} className={type}>
                <i className={icon} aria-hidden="true"></i>{text}
            </a>         
        );    
    }    
}

Button.propTypes = {
    type : PropTypes.string.isRequired,
    icon : PropTypes.string.isRequired,
    onClick: PropTypes.func,
    text : PropTypes.string
};