
//


//



import { EventEmitter } from 'events';
import assert from 'assert';


export const getDOM = (dom)=>
    typeof dom === 'string' ?
        document.querySelector(dom) :
        dom;



export class View extends EventEmitter {

    constructor(domElement){
        super();
        this.domElement = getDOM(domElement);
        assert(!!this.domElement, `Unable to resolve domElement from ${domElement}`);
    }

    set visible(val){
        if(val !== this.visible){
            this.domElement.classList[val ? 'remove' : 'add']('hidden');
        }
    }

    get visible(){
        return !this.domElement.classList.contains('hidden');
    }


    _setEventMap(map){
        this.events = map;
        //this.__removeEventListeners = eventMap(this.domElement, map);
    }

    shouldComponentUpdate(){
        return true;
    }

    render(){
        return this;
    }

    removeEventListeners(){
        this.__removeEventListeners && this.__removeEventListeners();
    }

    remove(){
        this.removeEventListeners();
        this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement);
    }
}
