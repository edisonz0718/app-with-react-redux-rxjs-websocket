import "moment-duration-format";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import configureStore from "./stores/configureStore";

import "shared/operators";

import "./main.scss";
import {socket} from "./services"; 
import App from "./containers/App.jsx";

const store = configureStore();

// Auth
/*
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
*/
//-----------------------------------
// Components

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("site-wrap")
);

//-----------------------------------
// Bootstrap

socket.connect(); 

