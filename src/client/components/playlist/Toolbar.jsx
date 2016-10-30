import React , {Component, PropTypes} from "react";
import Button from "../player/Button.jsx";

export default class Toolbar extends Component {
    render(){
        return (
            <div className="toolbar">
                <Button 
                    type="add-button" 
                    text=" add" 
                    icon="fa fa-plus-square" 
                    onClick={this.props.addSource}
                />      
                <Button 
                    type="edit-button" 
                    text=" edit" 
                    icon="fa fa-pencil-square" 
                    onClick={this.props.enterEdit}
                />
            </div>
        );
    }    
}

Toolbar.PropTypes = {
    //addSource: PropTypes.func.isRequired
};