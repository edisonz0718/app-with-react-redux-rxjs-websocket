import React , {Component, PropTypes} from "react";

import ItemList from "./ItemList.jsx";
import ContextMenu from "./ContextMenu.jsx";

export default class ScrollArea extends Component {
    render(){
        return (
            <div className="scroll-area">
                <div className="placeholder"></div>        
                <ItemList sources={this.props.sources}/>
                <ContextMenu />
            </div>
        );
    }
}

ScrollArea.propTypes = {
        
};