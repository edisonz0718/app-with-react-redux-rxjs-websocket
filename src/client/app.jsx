import $ from "jquery";
import "moment-duration-format";
import React from "react";
import ReactDOM from "react-dom";

import "shared/operators";

import "./app.scss";

import * as services from "./services"; 

import Users from "./components/users/Users.jsx";
import Chat from "./components/chat/Chat.jsx";
import Player from "./components/player/Player.jsx";
import Playlist from "./components/playlist/Playlist.jsx";
/*
//-----------------------------------
// PLAYGROUND
services.server.emitAction$("login",{username: "foo", password: "bar"})
    .subscribe(user=>{
        console.log("We're logged in: " + user);
    }, error =>{
        console.error(error);
    }
    );
//-----------------------------------
*/
// Auth
const $html = $("html");
services.usersStore.currentUser$.subscribe(user =>{
    if(user.isLoggedIn){
        $html.removeClass("not-logged-in");
        $html.addClass("logged-in");
    } else {
        $html.addClass("not-logged-in");
        $html.removeClass("logged-in");
    }
});

//-----------------------------------
// Components
//require("./components/users/users");
ReactDOM.render(
    <Users usersStore = {services.usersStore}/>,    
    document.getElementById("users")
);
ReactDOM.render(
    <Chat 
        chatStore = {services.chatStore} 
        usersStore = {services.usersStore} 
        server = {services.server}
    />,    
    document.getElementById("chat")
);

ReactDOM.render(
    <Player
        playlistStore = {services.playlistStore}
    />,
    document.getElementById("player")
);
ReactDOM.render(
    <Playlist
        playlistStore = {services.playlistStore}
    />,
    document.getElementById("playlist")
);

//require("./components/player/player");
//require("./components/chat/chat");
//require("./components/playlist/playlist");
//-----------------------------------
// Bootstrap

services.socket.connect(); 

