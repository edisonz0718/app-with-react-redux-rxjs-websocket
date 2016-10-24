import React , {Component , PropTypes} from "react";

export default class Player extends Component {
    constructor(props){
        super(props);
    }    
    render(){
        return (
            <div className="player"></div>     
        );
    }
}

Player.propTypes = {
    playlistStore: PropTypes.object.isRequired   
};