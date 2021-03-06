import $ from "jquery";
import {Observable} from "rxjs";

import {ElementComponent} from "../../lib/component";


export class PlaylistToolbarComponent extends ElementComponent {
    constructor(playlistStore){
        super();
        this._playlist = playlistStore;
        this.$element.addClass("toolbar");
    }
    
    _onAttach() {
        const $addButton = $(`
            <a href="#" class="add-button">
                <i class="fa fa-plus-square" /> add
            </a>`).appendTo(this.$element);
            
        Observable.fromEventNoDefault($addButton,"click")
            .mergeMap(()=>Observable.fromPrompt("Enter the URL of the video"))
            .filter(url => url && url.trim().length)
            .mergeMap(url=> this._playlist.addSource$(url).catchWrap())
            .compSubscribe(this,result=>{
                if(result && result.error)
                    alert(result.error.message || "Unknown Error");
            });
    }
}