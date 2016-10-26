import React , {Component, PropTypes} from "react";
import moment from "moment";

import Progress from "../player/Progress.jsx";

export default class Item extends Component {
    render(){
        const {source} = this.props;
        return (
            <li>
                <div className="inner">
                    <div className="thumb-wrapper">
                        <img className="thumb" src={source.thumb}/>
                    </div> 
                    <div className="details">
                        <span className="title" title={source.title}>{source.title}</span>
                        <time>{moment.duration(source.totaltime,"seconds").format()}</time>
                    </div>
                    <Progress type="progress"/> 
                </div>     
            </li>
        );
    }    
}

Item.propTypes = {
    source: PropTypes.object.isRequired
};