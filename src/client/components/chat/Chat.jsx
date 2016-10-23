import "./chat.scss";
import moment from "moment";
import React , {Component, PropTypes} from "react";
import {Observable} from "rxjs";

import ChatList from "./ChatList.jsx";
import ChatForm from "./ChatForm.jsx";

export default class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            messages: []    
        }; 
        
    }
    componentDidMount(){
        const {chatStore, usersStore, server} = this.props;
        Observable.merge(
            chatStore.message$.map(this.chatMessageFactory),
            usersStore.state$.map(this.userActionFactory),
            server.status$.map(this.serverStatusFactory))
            .filter(m=>m)
            .subscribe(newMessage => {
                const {messages} = this.state;    
                messages.push(newMessage);
                this.setState({messages});
            });
        
    }
    userActionFactory({type, user}){
        if(type !=="add" && type !== "remove")
            return null;
        
        const actionClass = `user-action ${type}`;
        const userStyle = {
            color: user.color    
        };
        //return 0;
        
        return (
            <li className={actionClass} key ={Math.random()*1000}>
                <span className="author" style={userStyle}>{user.name}</span>
                <span className="message">{type === "add" ? "joined": "left"}</span>
                <time>{moment().format("h:mm:ss a")}</time>           
            </li>     
        );
        
    }
    serverStatusFactory({isConnected, isReconnecting, attempt}){
        let statusMessage = null;
        if(isConnected) statusMessage = "connected";
        else if(isReconnecting) statusMessage = `reconnecting (attempt ${attempt})`;
        else statusMessage = "gg. it's over now";
        
        if(statusMessage == null)
            return null;
        
        //return 1;
         
        return (
            <li className="server-status" key ={Math.random()*1000}>
                <span className="author">system</span>
                <span className="message">{statusMessage}</span>
                <time>{moment().format("h:mm:ss a")}</time>
            </li>     
        );
        
    } 
    chatMessageFactory({user,message,type,time}){
        const chatClass =`message ${type}`;
        const userStyle = {
            color: user.color    
        };
        //return 2;
        
        return (
            <li className ={chatClass} key ={Math.random()*1000}>
                <span className="author" style={userStyle}>{user.name}</span>
                <span className="message">{message}</span>
                <time>{moment(time).format("h:mm:ss a")}</time>                          
            </li>                
        );
        
    }
    render(){
        return (
            <div>
            <h1></h1>    
            <ChatList {...this.state}/>
            </div>
        );
        
            //<ChatForm className="chat-form"/>
    } 
}

Chat.propTypes = {
    chatStore: PropTypes.object.isRequired,  
    usersStore: PropTypes.object.isRequired,
    server: PropTypes.object.isRequired
};