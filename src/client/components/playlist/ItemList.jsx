import React , {Component, PropTypes} from "react";
import Item from "./Item.jsx";
export default class ItemList extends Component{
    render(){
        const {sources} = this.props;
        return (
            <ul className="playlist-list">
                {sources.map(source =>{
                    return (
                        <Item 
                            key={source.id}
                            source ={source} 
                        />);
                })}
            
            </ul>     
        );
    }    
}

ItemList.propTypes = {
    sources: PropTypes.array
};