import { FFT } from "tone";
import { scaleFreq, freqInRange } from "../data/Position";

export class Spectrum {
  constructor(source) {
    const size = 512;

    this._analyser = new FFT(size);
    source.connect(this._analyser);

    const fftSize = 2 * size;

    const sampleRate = this._analyser.context.sampleRate;
    this._scaling = [];
    for (let index = 0; index < size; index++) {
      const frequency = index * (sampleRate / fftSize);
      const centerFreq = (index + 0.5) * (sampleRate / fftSize);
      this._scaling[index] = {
        frequency,
        include: freqInRange(frequency),
        position: 1 - scaleFreq(frequency),
        centerPosition: 1 - scaleFreq(centerFreq),
      };
    }
  }

  getSpectrum() {
    const values = this._analyser.getValue();

    const scaling = this._scaling;
    return {
      values,
      forEach(cb) {
        values.forEach((val, index) => {
          const obj = scaling[index];
          if (obj.include) {
            //scale all the values between 0-1
            val = Math.pow(
              Math.clamp(Math.scale(val, -100, -30, 0, 1), 0, 1),
              2
            );
            val = Math.pow(val, 2);
            cb(val, index, scaling[index]);
          }
        });
      },
    };
  }
}
