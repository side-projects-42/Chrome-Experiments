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

define(["style/toggle.scss", "interface/ToggleSwitch", "Translation"], function (toggleStyle, Toggle, Translate) {

	var ModeToggle = function(container){

		this.element = document.createElement("DIV");
		this.element.id = "ToggleContainer";
		container.appendChild(this.element);

		this.toggle = new Toggle(this.element, Translate.localize("Chords_UI_Minor"), Translate.localize("Chords_UI_Major"), true);

		this.toggle.onchange = this.toggled.bind(this);

		this.onChange = function(){};
	};

	ModeToggle.prototype.toggled = function(val){
		this.onChange(val ? "major" : "minor");
	};

	return ModeToggle;
});