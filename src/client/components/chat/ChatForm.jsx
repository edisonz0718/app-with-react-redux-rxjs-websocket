import React, {Component, PropTypes} from "react";

export default class ChatForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: "",
            inputError: false,
            errorMessage: ""
        };
    }
    handleChange(e){
        console.log(this.node.focus);
        this.setState({value: e.target.value}); 
    }
    handleSubmit(e){
        if(e.keyCode === 13){
            this.setState({value:""});
            this.props.handleSubmit(e)
                .subscribe(response => {
                    if(response && response.error)    
                        this.setState({inputError: true, errorMessage:response.error.message});    
                    else
                        this.setState({inputError: false});    
                });           
        }
    }
    componentDidUpdate(){
        this.node.focus();
    }
    
    render(){
        const errorStyle ={
            display:  `${this.state.inputError ? "block" : "none"}`    
        };
        return (
            <div className="chat-form">
                <div className="chat-error" style = {errorStyle}>{this.state.inputError ? this.state.errorMessage : ""}</div>     
                <input 
                    type="text" 
                    placeholder={this.props.isLoggedIn ? "": "Enter a username"} 
                    className="chat-input"
                    onChange = {this.handleChange.bind(this)}
                    value = {this.state.value}
                    onKeyDown = {this.handleSubmit.bind(this)}
                    disabled = {this.props.disabled}
                    autoFocus = "true"
                    ref = {node => this.node = node}
                />
            </div>     
        );
    }
}

ChatForm.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.string.isRequired
};

