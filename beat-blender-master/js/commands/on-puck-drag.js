
//


//




import * as grid2d from 'grid2d';

export default function({ state, set }, cursor, cell){
    const { x, y } = cursor;
    const index = grid2d.cellIndex(state.grid, cell.column, cell.row);

    set({
        puck: { x, y },
        selectedIndex: index
    });
}
