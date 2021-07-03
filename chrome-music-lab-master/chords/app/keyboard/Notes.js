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

define(function () {

	var chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	return {
		getNotes : function(start, end){
			var startOctave = parseInt(start.split(/(-?\d+)/)[1]);
			var startNote = start.split(/(-?\d+)/)[0];
			startNote = chromatic.indexOf(startNote);
			var endOctave = parseInt(end.split(/(-?\d+)/)[1]);
			var endNote = end.split(/(-?\d+)/)[0];
			endNote = chromatic.indexOf(endNote);

			var currentNote = startNote;
			var currentOctave = startOctave;

			var retNotes = [];

			while(!(currentNote === endNote && currentOctave === endOctave)){
				retNotes.push(chromatic[currentNote] + currentOctave);

				currentNote++;

				if (currentNote >= chromatic.length){
					currentNote = 0;
					currentOctave++;
				}
			}

			return retNotes;
		},
		/**
		 * Get the offset between the start note
		 * and the give note
		 */
		getDistanceBetween : function(start, note){
			var notes = this.getNotes(start, note);
			var dist = 0;
			for (var i = 0; i < notes.length; i++){
				var n = notes[i];
				if ((n[0] === "E" || n[0] === "B") && n[1] !== "#"){
					dist += 1;
				} else {
					dist += 0.5;
				}
			}
			return dist;
		}
	};
});