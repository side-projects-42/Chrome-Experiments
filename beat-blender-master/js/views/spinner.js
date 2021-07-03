// Copyright 2018 Google LLC
//


//



import { View } from './base-view';


const template = ({ innerWidth, innerHeight })=>`
    <svg style="position: absolute; left: ${innerWidth/2 -3}px; top: ${innerHeight/2 - 30}px;" class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>`;


export class Spinner extends View {

    constructor(domElement){
        super(domElement || document.createElement('div'));
        /*this.domElement.classList.add('modal');
        this.domElement.classList.add('active');*/
        document.body.appendChild(this.domElement);
    }

    shouldComponentUpdate(state, last){
        return state.loading !== last.loading || state.innerWidth !== last.innerWidth || state.innerHeight !== last.innerHeight;
    }

    render(state, last){
        this.domElement.innerHTML = state.loading ? template(state) : '';
        Object.assign(this.domElement.style, {
            display: state.loading ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)'
        });
        return super.render(state, last);
    }
}

