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
            totalTime: 0,
            editMode: false
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
                    source.isPlaying = false;
                    source.progress = 0;
                    source.adding = false;
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
        playlistStore.actions$
            .filter(a => a.type === "add")
            .subscribe(({source}) => {
                const {sources} = this.state;
                source.isPlaying = false;
                source.progress = 0;
                source.adding = true;
                sources.push(source);
                this.setState({sources});
                
                setTimeout(function(){
                    sources[sources.length -1].adding = false;
                    this.setState({sources});
                }.bind(this),250);
            });
        
        playlistStore.actions$
            .filter(a => a.type === "remove")
            .subscribe(({source}) => {
                const {sources} = this.state;    
                const index = sources.indexOf(source);
                if(index == -1)
                    console.error(`removing item is not in the list`);
                sources.splice(index,1);
                this.setState({sources});
            });
            
        let lastComp = null;
        playlistStore.serverTime$
            .subscribe(current => {
                const {sources} = this.state; 
                const lastIndex =sources.indexOf(lastComp); 
                if(current.source == null) {
                    if(lastComp != null && lastIndex != -1){
                        
                        lastComp.isPlaying = false;
                        
                        sources[lastIndex] = lastComp;
                        lastComp = null;
                        this.setState({sources});
                    }
                    return;
                }
                const currentIndex = sources.indexOf(current.source);
                if(currentIndex === -1){
                    console.error(`Cannont find component for ${current.source.id} / ${current.source.title}`);
                    return;
                }
                const currentComp = sources[currentIndex];
                if(lastComp != currentComp){
                    if(lastComp != null && lastIndex != -1){
                        lastComp.isPlaying = false;
                        sources[lastIndex] = lastComp;
                    }
                     
                    lastComp = currentComp;
                    currentComp.isPlaying = true;
                   /* 
                    const scrollTop = currentComp.$element.offset().top - 
                        this.$element.offset().top +
                        this.$element.scrollTop() -
                        currentComp.$element.height*2;
                        
                    this._$mount.animate({scrollTop});
                    */
                }
                
                currentComp.progress = current.progress;// pass current.progress from playlist store to the playlistItem's progress setter.
                sources[currentIndex] = currentComp; 
                this.setState({sources});
                
            });
    }
    addSource(){
        Observable.fromPrompt("Enter the URL of the video")
        .filter(url => url && url.trim().length)
        .mergeMap(url => this.props.playlistStore.addSource$(url).catchWrap())
        .subscribe(result=>{
            if(result && result.error)
                alert(result.error.message || "Unknown Error");
        });
    }
    enterEdit(){
        if(this.state.editMode)
            this.setState({editMode:false});    
        else
            this.setState({editMode:true});    
    }
    playSource(source){
        this.props.playlistStore.setCurrentSource$(source)
            .catchWrap()
            .subscribe(response=>{
                if(response && response.error)
                    alert(response.error.message || "Unknown Error");
            });
    }
    deleteSource(source){
        this.props.playlistStore.deleteSource$(source)
            .catchWrap()
            .subscribe(response=>{
                if(response && response.error)
                    alert(response.error.message || "Unknown Error");
            });
    }
    render(){
        return(
            <section className="playlist">
                <h1>
                    <span className="title">{this.state.title}</span>
                    <span className="info">{this.state.totalTime}</span>
                </h1>
                <Toolbar 
                    addSource = {this.addSource.bind(this)} 
                    enterEdit={this.enterEdit.bind(this)}
                />
                <Chrome 
                    sources={this.state.sources} 
                    playSource={this.playSource.bind(this)}
                    deleteSource={this.deleteSource.bind(this)}
                    editMode={this.state.editMode}
                />
            </section>     
        );
    } 
}

Playlist.propTypes = {
    playlistStore: PropTypes.object.isRequired
};