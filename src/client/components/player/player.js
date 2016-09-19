import $ from "jquery";
import {ElementComponent}  from "../../lib/component";

import "./player.scss";

class PlayComponent extends ElementComponent {
    constructor() {
        super() ;   
    }
    
    _onAttach() {
        const $title = this._$mount.find("h1");
        $title.text("Player");
        
        this.$element.append("<h1>HEY</h1>");
    }
    
}
let component;
try{
    component = new PlayComponent();
    component.attach($("section.player"));
} catch(e){
    console.error(e);
    if(component)
        component.detach();
} finally {
    if(module.hot){
        module.hot.accept();
        module.hot.dispose(()=>component && component.detach());//if reloaded, dispose the old component
    }
}