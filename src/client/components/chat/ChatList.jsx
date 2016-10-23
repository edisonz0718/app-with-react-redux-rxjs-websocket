import React , {Component, PropTypes} from "react";

export default class ChatList extends Component {
    render(){
        
        return (
            <ul className="chat-messages">
                {this.props.messages}
            </ul>
        );
    }
}

ChatList.propTypes = {
    messages: PropTypes.array.isRequired
};