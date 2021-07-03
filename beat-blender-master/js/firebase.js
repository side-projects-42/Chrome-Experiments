
//


//



/*global: firebase */
import { generate as uuid }  from 'shortid';
const { firebase } = window;

// Initialize Firebase
const config = {
    //put your firebase config here
};


//uncomment here to use database
//firebase.initializeApp(config);


//the keys in state that we care about storing
const keys = [
    'encodedSequences',
    'sequenceUUID',
    'selectedIndex',
    'sequence',
    'bpm',
    'playMode',
    'path',
    'pathIntersections',
    'pathLerp',
    'puck',
    'gradient',
    'grid'
];

const parseState = (state)=>
    keys.reduce((mem, key)=>{
        mem[key] = state[key];
        return mem;
    }, {});


export const save = (state)=>{
    const id = uuid();
    return firebase.database().ref(`shares/${id}`)
        .set(parseState(state))
        .then(function(){ console.log(arguments); return id; });
};

export const get = (uid='')=>
    firebase.database().ref(`shares/${uid}`).once('value');



