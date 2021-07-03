
//


//




import { distance } from '../utils';

export default function({ state, set }, cursor){
    state.pathLerp = 0;

    const pt = {
        x: cursor.x,
        y: cursor.y
    };

    const path = state.path;

    if(!path.length || distance(path[path.length-1], pt) > 0.01){
        path.push(pt);
    }

    set({
        pathLerp: 0,
        path
    });
}
