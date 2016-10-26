import React, {Component, PropTypes} from "react";

import Toolbar from "./Toolbar.jsx";
import Chrome from "./Chrome.jsx";

export default class Playlist extends Component{
    render(){
        return(
            <div>
                <h1>
                    <span className="title"></span>
                    <span className="info"></span>
                </h1>
                <Toolbar />
                <Chrome />
            </div>     
        );
    } 
}

Playlist.propTypes = {
    playlistStore: PropTypes.object.isRequired
};