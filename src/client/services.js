import io from "socket.io-client";

import {ObservableSocket} from "shared/observable-socket";
export const socket = io({autoConnect : false}); // connect in app.js
export const server = new ObservableSocket(socket);
// create socket wrapper

//create playlist store
//create user store
//create chat store