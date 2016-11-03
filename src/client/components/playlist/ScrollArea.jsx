import React , {Component, PropTypes} from "react";

import ItemList from "./ItemList.jsx";
//import ContextMenu from "./ContextMenu.jsx";

export default class ScrollArea extends Component {
    render(){
        return (
            <div className="scroll-area">
                <ItemList {...this.props}/>
            </div>
        );
    }
}

ScrollArea.propTypes = {
        
};