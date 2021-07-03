
//


//



import { save, get } from './firebase';
import DAT from 'dat-gui';


let _initialized = false;


export const isInitialized = ()=>_initialized;


export const initialize = function(state, page){
    if(_initialized){
        return;
    }
    _initialized = true;
    const gui = new DAT.GUI();

    get().then(snapshot=>{

        const shareState = {
            save: ()=> save(state).then((snapshot)=> console.log(snapshot)),
            selected: null
        };

        const shares = snapshot.val();

        gui.add(shareState, 'selected', Object.keys(shares)).onChange(key=>{
            page(`/share/${key}`);
        });

        gui.add(shareState, 'save');
    });
};
