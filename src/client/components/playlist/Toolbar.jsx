import React , {Component, PropTypes} from "react";
import Button from "../player/Button.jsx";

export default class Toolbar extends Component {
    render(){
        return (
            <div className="toolbar">
                <Button type="add-button" text="add" icon="fa fa-plus-square" />      
            </div>
        );
    }    
}

Toolbar.PropTypes = {
};