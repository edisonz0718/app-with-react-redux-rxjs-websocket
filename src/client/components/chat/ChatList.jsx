import React , {Component, PropTypes} from "react";

export default class ChatList extends Component {
    componentDidUpdate(){
        this.node.scrollTop = this.node.scrollHeight;
    }
    render(){
        
        return (
            <ul className="chat-messages" ref= {node => this.node = node}>
                {this.props.messages}
            </ul>
        );
    }
}

ChatList.propTypes = {
    messages: PropTypes.array.isRequired
};