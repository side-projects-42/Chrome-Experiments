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

define(["chordlabel.scss", "Translation"], function (labelStyle, Translate) {

	var ChordLabel = function(container){

		this.element = document.createElement("DIV");
		this.element.id = "ChordLabel";
		container.appendChild(this.element);

		this.text = document.createElement("DIV");
		this.text.id = "Text";
		this.element.appendChild(this.text);

		this.text.textContent = Translate.localize("Chords_UI_Press_Key");

	};

	ChordLabel.prototype.setChord = function(key, mode){
		key = key[0].toUpperCase() + key.substring(1);
		this.text.textContent = Translate.localizeChord(key, mode);
	};

	return ChordLabel;
});