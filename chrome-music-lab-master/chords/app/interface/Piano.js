/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["keyboard/Piano", "piano.scss", "teoria", "Tone/core/Tone"], 
function (PianoComp, pianoStyle, teoria, Tone) {

	
	var Piano = function(container, lowestNote, highestNote){

		/**
		 * the element
		 */
		this.element = document.createElement("DIV");
		this.element.id = "Piano";
		container.appendChild(this.element);

		/**
		 * the piano rendering
		 */
		this.piano = new PianoComp(this.element, lowestNote, highestNote);
		this.piano.setHighlightColor("#ffb729");
		this.piano.onkeydown = this.clicked.bind(this);

		this.piano.oncontextstart = function(){
			Tone.startMobile();
		};

		/**
		 * The callback to invoke on each click
		 */
		this.onNotes = function(){};

		/**
		 * the currently selected notes
		 */
		this.selected = [];

		/**
		 * the current mode of the piano. 
		 * "major" | "minor"
		 */
		this.mode = "major";

		/**
		 * the name of the key that we're in.
		 */
		this.key = null;

		/**
		 * the timeouts for each note
		 */
		this.timeouts = {};

		window.addEventListener("resize", function(){
			this.piano._resize();
		}.bind(this));
	};

	/**
	 * the delay time between sequential notes
	 * @type {Number}
	 */
	Piano.prototype.delayTime = 0.05;

	Piano.prototype.clicked = function(midiNote){
		this.setChord(midiNote);
	};

	Piano.prototype.setChord = function(pitchOctave){
		this.clearTimeouts();
		var note = teoria.note(pitchOctave);
		this.key = note;
		var chord = note.chord(this.mode).notes();
		//unselect the previous notes
		this.unselectAll();
		var notes = [];
		for (var i = 0; i < chord.length; i++){
			chordNote = chord[i];
			var midiNote = chordNote.midi();
			var scientific = teoria.note.fromMIDI(midiNote).scientific();
			this.piano.keyDown(scientific);
			notes.push(scientific);
			this.triggerNote(scientific, this.delayTime * (i + 1));
		}
		this.onNotes(notes, this.key.name() + this.key.accidental(), this.mode);
	};

	Piano.prototype.triggerNote = function(note, delay){
		this.timeouts[note] = setTimeout(function(){
			//set the note as highlighted for a short time
			this.piano.highlight(note, "#996e19", "#996e19");
			this.timeouts[note] = setTimeout(function(){
				this.piano.keyDown(note);
			}.bind(this), this.delayTime * 1200);
		}.bind(this), delay * 1000);
	};

	Piano.prototype.clearTimeouts = function(){
		for (var id in this.timeouts){
			clearTimeout(this.timeouts[id]);
		}
		this.timeouts = {};
	};

	Piano.prototype.setMode = function(mode){
		this.mode = mode;
		if (this.key){
			this.setChord(this.key.scientific());
		}
	};

	Piano.prototype.unselectAll = function() {
		this.piano.unselectAll();
	};

	return Piano;
});