//

//

import { View } from "./base-view";

const DEFAULT_TEXT = "Select Midi Out";

const template = (text, isSelected) => `
    <option ${isSelected ? "selected" : ""}>${text}</option>`;

export class SelectMidiOut extends View {
  constructor(domElement) {
    super(domElement);

    this._setEventMap({
      change: (evt) => this.emit("change", this, evt.target.selectedIndex - 1), //-1 because of the default option
    });
  }

  shouldComponentUpdate({ midiOut }, { midiOut: lMidiOut }) {
    //deep-equals cause it could be a clone
    if (midiOut && !lMidiOut) {
      return true;
    }
    if (midiOut.length !== lMidiOut.length) {
      return true;
    }

    for (let i = 0; i < midiOut.length; i++) {
      if (midiOut[i] !== lMidiOut[i]) {
        return true;
      }
    }
    return false;
  }

  render(state) {
    this.domElement.innerHTML = [template(DEFAULT_TEXT)]
      .concat(
        state.midiOut.map((device, i) =>
          template(device, i === state.selectedMidiOutIndex)
        )
      )
      .join("");

    return super.render();
  }
}
