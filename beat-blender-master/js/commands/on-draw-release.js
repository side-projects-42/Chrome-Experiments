//

//

import { lerpPath, pathLength, times } from "../utils";
import * as grid2d from "grid2d";

export default function ({ state, set }) {
  if (!state.path.length) {
    return;
  }

  const n = pathLength(state.path) * 30;
  const equids = times(n, (i, n) => lerpPath(state.path, i / (n - 1)));

  const cells = [];

  const points = [];
  let lastCell = {};
  for (let i = 0; i < equids.length; i++) {
    const cell = grid2d.intersectsCellPosition(state.grid, equids[i]);
    if (cell.column === lastCell.column && cell.row === lastCell.row) {
      continue;
    }
    cells.push(cell);
    points.push(grid2d.center(grid2d.createCellForPosition(state.grid, cell)));
    lastCell = cell;
  }

  set({
    path: equids,
    pathIntersections: cells,
  });
}
