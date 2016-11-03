import React , {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {opList, opAdd, opRemove} from "../actions/usersAction";
import Users from "../components/users/Users.jsx";
import Chat from "../components/chat/Chat.jsx";
import Player from "../components/player/Player.jsx";
import Playlist from "../components/playlist/Playlist.jsx";
import {usersStore, chatStore, playlistStore, server} from "../services";


class App extends Component {
    constructor(props){
        super(props);    
        const {dispatch} = this.props;
        server.on$("users:list").subscribe(users =>{
            dispatch(opList(users));
        });
        server.on$("users:added").subscribe(user =>{
            dispatch(opAdd(user));
        });
        server.on$("users:removed").subscribe(user =>{
            dispatch(opRemove(user));
        });
        
        //Bootstrap
        server.on("connect",()=>{
            server.emit("users:list");
        });
    }
    render(){
        const {users} = this.props;
        return (
            <div>
                <div className="column left">
                    <Playlist playlistStore={playlistStore}/>
                </div>     
                <div className="column center">
                    <Player playlistStore={playlistStore}/>
                    <Chat 
                        chatStore={chatStore}
                        usersStore={usersStore}
                        server ={server}
                    />
                </div>                
                <div className="column right">
                    <Users users={users}/>
                </div>                           
            </div>
        );
    }
    
}
function mapStateToProps(state) {
    const {users} = state;    
    return {
        users
    };
}
App.propTypes = {
    users: PropTypes.object.isRequired
};
export default connect(mapStateToProps)(App);
