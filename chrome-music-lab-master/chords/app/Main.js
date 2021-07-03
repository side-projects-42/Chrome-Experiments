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

require(["domready", "main.scss", "interface/Piano", "sound/Arp",
	"interface/Toggle", "StartiOS", "Translation"], 
	function(domready, mainStyle, Piano, Arp, Toggle, StartiOS, Translation){

	//get the origin

	var lang = "en";

	if (window.location.search !== ""){
		lang = window.location.search.substring(4);
	}
	
	Translation.load(lang, function(){
		domready(function(){

			//the main box
			var container = document.createElement("DIV");
			container.id = "Container";
			document.body.appendChild(container);

			var lowestNote = "C3";
			var highestNote = "C5";

			//the piano
			var piano = new Piano(container, lowestNote, highestNote);

			var arp = new Arp(piano.delayTime, lowestNote, "G5");

			arp.load(function(){
				window.parent.postMessage("loaded", "*");
				StartiOS();
			});

			var toggle = new Toggle(container);

			var chordSelected = false;

			piano.onNotes = function(notes, root, mode){
				chordSelected = true;
				arp.play(notes);
			};

			toggle.onChange = function(mode){
				piano.setMode(mode);
			};
		});
	});
});