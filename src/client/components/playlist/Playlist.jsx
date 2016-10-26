import "./playlist.scss";
import React, {Component, PropTypes} from "react";
import {Observable} from "rxjs";
import Toolbar from "./Toolbar.jsx";
import Chrome from "./Chrome.jsx";
import moment from "moment";

export default class Playlist extends Component{
    constructor(props){
        super(props);
        this.state = {
            sources: [],        
            title: "",
            totalTime: 0
        };
    }
    componentDidMount(){
        const {playlistStore} = this.props;
        Observable.merge(
            playlistStore.state$.first(),
            playlistStore.actions$.filter(a=> a.type === "list"))
            .subscribe(({state})=>{
                const {sources} = this.state;
                for(let source of state.list){
                    sources.push(source);
                }
                this.setState({sources});
            });
        const updateActions$ = playlistStore.actions$
            .filter(a=> a.type == "add" || a.type == "remove" || a.type == "list");    
            
        playlistStore.state$.first()
            .merge(updateActions$)
            .subscribe(({state}) => {
                const totaltime = state.list.reduce((time,source) => time + source.totaltime, 0);
                this.setState({title:`${state.list.length} item${state.list.length == 1 ? "": "s"}`,
                    totalTime: moment.duration(totaltime, "seconds").format()});
            });
    }
    render(){
        return(
            <div>
                <h1>
                    <span className="title">{this.state.title}</span>
                    <span className="info">{this.state.totalTime}</span>
                </h1>
                <Toolbar />
                <Chrome sources={this.state.sources}/>
            </div>     
        );
    } 
}

Playlist.propTypes = {
    playlistStore: PropTypes.object.isRequired
};