import React , {Component, PropTypes} from "react";
import Item from "./Item.jsx";
import {spring, TransitionMotion} from "react-motion";

export default class ItemList extends Component{
    
    willLeave(){
        return {height: spring(0), opacity: spring(0)};
    }
    
    willEnter(){
        return {opacity: 0.9, height: 0}; 
    }
    
    render(){
        const {sources,playSource,deleteSource,editMode} = this.props;
        return (
            <TransitionMotion
                willLeave={this.willLeave}
                willEnter={this.willEnter}

                styles={sources.map(source =>({
                    key: source.id,
                    data: source,
                    style: {opacity:spring(1),height:spring(43)},
                }))}
            >
                {styles=>
                    <ul className="playlist-list">    
                        {styles.map(config => {
                            return <Item 
                                key={config.key} 
                                style={config.style}
                                source ={config.data} 
                                playSource={playSource}
                                deleteSource={deleteSource}
                                editMode={editMode}/>;
                        })}
                    </ul>
                }
            </TransitionMotion>
        );
    }    
}

ItemList.propTypes = {
    sources: PropTypes.array
};
