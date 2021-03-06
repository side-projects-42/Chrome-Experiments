define([
  "Tone/core/Tone",
  "Tone/instrument/MonoSynth",
  "Tone/source/Source",
], function (Tone) {
  "use strict";

  /**
   *  @class  Tone.PolySynth handles voice creation and allocation for any
   *          instruments passed in as the second paramter. PolySynth is
   *          not a synthesizer by itself, it merely manages voices of
   *          one of the other types of synths, allowing any of the
   *          monophonic synthesizers to be polyphonic.
   *
   *  @constructor
   *  @extends {Tone.Instrument}
   *  @param {number|Object} [polyphony=4] The number of voices to create
   *  @param {function} [voice=Tone.MonoSynth] The constructor of the voices
   *                                            uses Tone.MonoSynth by default.
   *  @example
   * //a polysynth composed of 6 Voices of MonoSynth
   * var synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
   * //set the attributes using the set interface
   * synth.set("detune", -1200);
   * //play a chord
   * synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
   */
  Tone.PolySynth = function () {
    Tone.Instrument.call(this);

    var options = this.optionsObject(
      arguments,
      ["polyphony", "voice"],
      Tone.PolySynth.defaults
    );
    options = this.defaultArg(options, Tone.Instrument.defaults);

    /**
     *  the array of voices
     *  @type {Array}
     */
    this.voices = new Array(options.polyphony);

    /**
     *  The queue of voices with data about last trigger
     *  and the triggered note
     *  @private
     *  @type {Array}
     */
    this._triggers = new Array(options.polyphony);

    //create the voices
    for (var i = 0; i < options.polyphony; i++) {
      var v = new options.voice(arguments[2], arguments[3]);
      this.voices[i] = v;
      v.connect(this.output);
      this._triggers[i] = {
        release: -1,
        note: null,
        voice: v,
      };
    }

    //set the volume initially
    this.volume.value = options.volume;
  };

  Tone.extend(Tone.PolySynth, Tone.Instrument);

  /**
   *  the defaults
   *  @const
   *  @static
   *  @type {Object}
   */
  Tone.PolySynth.defaults = {
    polyphony: 4,
    volume: 0,
    voice: Tone.MonoSynth,
  };

  /**
   *  Trigger the attack portion of the note
   *  @param  {Frequency|Array} notes The notes to play. Accepts a single
   *                                  Frequency or an array of frequencies.
   *  @param  {Time} [time=now]  The start time of the note.
   *  @param {number} [velocity=1] The velocity of the note.
   *  @returns {Tone.PolySynth} this
   *  @example
   * //trigger a chord immediately with a velocity of 0.2
   * poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
   */
  Tone.PolySynth.prototype.triggerAttack = function (notes, time, velocity) {
    if (!Array.isArray(notes)) {
      notes = [notes];
    }
    time = this.toSeconds(time);
    for (var i = 0; i < notes.length; i++) {
      var val = notes[i];
      //trigger the oldest voice
      var oldest = this._triggers[0];
      var oldestIndex = 0;
      for (var j = 1; j < this._triggers.length; j++) {
        if (this._triggers[j].release < oldest.release) {
          oldest = this._triggers[j];
          oldestIndex = j;
        }
      }
      oldest.release = Infinity;
      oldest.note = JSON.stringify(val);
      oldest.voice.triggerAttack(val, time, velocity);
    }
    return this;
  };

  /**
   *  Trigger the attack and release after the specified duration
   *
   *  @param  {Frequency|Array} notes The notes to play. Accepts a single
   *                                  Frequency or an array of frequencies.
   *  @param  {Time} duration the duration of the note
   *  @param  {Time} [time=now]     if no time is given, defaults to now
   *  @param  {number} [velocity=1] the velocity of the attack (0-1)
   *  @returns {Tone.PolySynth} this
   *  @example
   * //trigger a chord for a duration of a half note
   * poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
   */
  Tone.PolySynth.prototype.triggerAttackRelease = function (
    notes,
    duration,
    time,
    velocity
  ) {
    time = this.toSeconds(time);
    this.triggerAttack(notes, time, velocity);
    this.triggerRelease(notes, time + this.toSeconds(duration));
    return this;
  };

  /**
   *  Trigger the release of the note. Unlike monophonic instruments,
   *  a note (or array of notes) needs to be passed in as the first argument.
   *  @param  {Frequency|Array} notes The notes to play. Accepts a single
   *                                  Frequency or an array of frequencies.
   *  @param  {Time} [time=now]  When the release will be triggered.
   *  @returns {Tone.PolySynth} this
   *  @example
   * poly.triggerRelease(["Ab3", "C4", "F5"], "+2n");
   */
  Tone.PolySynth.prototype.triggerRelease = function (notes, time) {
    if (!Array.isArray(notes)) {
      notes = [notes];
    }
    time = this.toSeconds(time);
    for (var i = 0; i < notes.length; i++) {
      //get the voice
      var stringified = JSON.stringify(notes[i]);
      for (var v = 0; v < this._triggers.length; v++) {
        var desc = this._triggers[v];
        if (desc.note === stringified && desc.release > time) {
          desc.voice.triggerRelease(time);
          desc.release = time;
        }
      }
    }
    return this;
  };

  /**
   *  Set a member/attribute of the voices.
   *  @param {Object|string} params
   *  @param {number=} value
   *  @param {Time=} rampTime
   *  @returns {Tone.PolySynth} this
   *  @example
   * poly.set({
   * 	"filter" : {
   * 		"type" : "highpass"
   * 	},
   * 	"envelope" : {
   * 		"attack" : 0.25
   * 	}
   * });
   */
  Tone.PolySynth.prototype.set = function (params, value, rampTime) {
    for (var i = 0; i < this.voices.length; i++) {
      this.voices[i].set(params, value, rampTime);
    }
    return this;
  };

  /**
   *  Get the synth's attributes. Given no arguments get
   *  will return all available object properties and their corresponding
   *  values. Pass in a single attribute to retrieve or an array
   *  of attributes. The attribute strings can also include a "."
   *  to access deeper properties.
   *  @param {Array=} params the parameters to get, otherwise will return
   *  					   all available.
   */
  Tone.PolySynth.prototype.get = function (params) {
    return this.voices[0].get(params);
  };

  /**
   *  Trigger the release portion of all the currently active voices.
   *  @param {Time} [time=now] When the notes should be released.
   *  @return {Tone.PolySynth} this
   */
  Tone.PolySynth.prototype.releaseAll = function (time) {
    time = this.toSeconds(time);
    for (var i = 0; i < this._triggers.length; i++) {
      var desc = this._triggers[i];
      if (desc.release > time) {
        desc.release = time;
        desc.voice.triggerRelease(time);
      }
    }
    return this;
  };

  /**
   *  Clean up.
   *  @returns {Tone.PolySynth} this
   */
  Tone.PolySynth.prototype.dispose = function () {
    Tone.Instrument.prototype.dispose.call(this);
    for (var i = 0; i < this.voices.length; i++) {
      this.voices[i].dispose();
      this.voices[i] = null;
    }
    this.voices = null;
    this._triggers = null;
    return this;
  };

  return Tone.PolySynth;
});
