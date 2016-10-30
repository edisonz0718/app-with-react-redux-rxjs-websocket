import React , {Component, PropTypes} from "react";
import moment from "moment";

import Progress from "../player/Progress.jsx";
import Button from "../player/Button.jsx";

export default class Item extends Component {
  
    onClick(){
        if(!this.props.editMode)
            this.props.playSource(this.props.source);    
    }
    deleteSource(){
        if(this.props.editMode)
             this.props.deleteSource(this.props.source);               
    }

    render(){
        const {source,editMode,style} = this.props;
        return (
            <li onClick={this.onClick.bind(this) }
                style={style}
                className={
                    (editMode?"edit ":"")
                    + (source.isPlaying && !editMode? "is-playing ":"") 
                    + (source.adding ? "selected ":"")
                }>
                <div className="inner">
                    <div className="thumb-wrapper">
                        <img className="thumb" src={source.thumb}/>
                    </div> 
                    <div className="details">
                        <span className="title" title={source.title}>{source.title}</span>
                        <time>{moment.duration(source.totaltime,"seconds").format()}</time>
                    </div>

                    <Progress type="progress" width={source.progress}/> 
                </div>     
                <Button 
                    type="delete-btn"
                    icon="fa fa-trash"
                    onClick={this.deleteSource.bind(this)}/>
            </li>
        );
    }    
}

Item.propTypes = {
    source: PropTypes.object.isRequired
};