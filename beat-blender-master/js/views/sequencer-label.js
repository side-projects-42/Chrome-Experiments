//

//

import { View } from "./base-view";
import { xForColumn, yForRow } from "grid2d";
import { MOBILE_PORTRAIT } from "../models/responsive";

export class SequencerLabel extends View {
  constructor(domElement) {
    super(domElement);
  }

  render(state) {
    let label = "";
    /*const { width } = this.domElement.getBoundingClientRect();
        const height = ~~(cellHeight(state.grid) * width / 2);
        this.domElement.style.height = `${height}px`;*/

    const lg = state.layoutGrid;
    const [a, b] = state.layoutItems.sequencerLabel;

    if (!a || !b) {
      return;
    }

    const x1 = xForColumn(lg, a.column);
    const x2 = xForColumn(lg, b.column);
    const y1 = yForRow(lg, a.row);
    const y2 = yForRow(lg, b.row);

    const height = `${(y2 - y1) * state.innerHeight}px`;

    let css =
      state.layout === MOBILE_PORTRAIT
        ? {
            position: "relative",
            top: 0,
            left: 0,
            width: "100%",
            height,
          }
        : {
            position: "absolute",
            left: `${x1 * state.innerWidth}px`,
            top: `${y1 * state.innerHeight}px`,
            width: `${(x2 - x1) * state.innerWidth}px`,
            height,
          };

    Object.assign(this.domElement.style, css);

    if (state.selectedCornerIndex > -1) {
      label = `Editing corner ${state.selectedCornerIndex + 1}`;
    } else {
      label = ""; //`Sampling column ${pos.column + 1}, row ${pos.row + 1}`;
    }
    this.domElement.innerHTML = label;
  }
}
