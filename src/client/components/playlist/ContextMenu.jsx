import React , {Component , PropTypes} from "react";
import Button from "../player/Button.jsx";

export default class ContextMenu extends Component {
    render(){
        return (
            <div className="context-menu">
                <Button type="play" icon="fa fa-play-circle" text="Play"/>
                <Button type="delete" icon="fa fa-trash" text="Delete"/>
            </div>    
        );
    }
}

ContextMenu.propTypes = {
};