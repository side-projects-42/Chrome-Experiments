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

define(["style/toggleswitch.scss"], function (mainStyle, Slider) {

	var Toggle = function(container, leftLabel, rightLabel, initialValue){

		/**
		 * The current value of the toggle
		 * @type {Boolean}
		 * @private
		 */
		this._value = false;

		/**
		 * The toggle container
		 * @type {Element}
		 * @private
		 */
		this._container = document.createElement("div");
		this._container.classList.add("Toggle");
		container.appendChild(this._container);

		/**
		 * The slider
		 * @type {Element}
		 * @private
		 */
		this._slider = document.createElement("div");
		this._slider.id = "Slider";
		this._container.appendChild(this._slider);

		/**
		 * The railing
		 * @type {Element}
		 * @private
		 */
		this._sliderRailing = document.createElement("div");
		this._sliderRailing.id = "Rail";
		this._slider.appendChild(this._sliderRailing);

		/**
		 * The hanlde
		 * @type {Element}
		 * @private
		 */
		this._sliderHandle = document.createElement("div");
		this._sliderHandle.id = "Handle";
		this._slider.appendChild(this._sliderHandle);
		this._slider.addEventListener("mousedown", this._change.bind(this));
		this._slider.addEventListener("touchstart", this._change.bind(this));

		/**
		 * The label on the left side
		 * @type {Element}
		 * @private
		 */
		this._leftLabel = document.createElement("div");
		this._leftLabel.id = "Left";
		this._leftLabel.classList.add("Label");
		this._leftLabel.textContent = leftLabel || "";
		this._leftLabel.addEventListener("mousedown", this._setFalse.bind(this));
		this._leftLabel.addEventListener("touchstart", this._setFalse.bind(this));
		this._container.appendChild(this._leftLabel);

		/**
		 * The label on the left side
		 * @type {Element}
		 * @private
		 */
		this._rightLabel = document.createElement("div");
		this._rightLabel.id = "Right";
		this._rightLabel.classList.add("Label");
		this._rightLabel.textContent = rightLabel || "";
		this._rightLabel.addEventListener("mousedown", this._setTrue.bind(this));
		this._rightLabel.addEventListener("touchstart", this._setTrue.bind(this));
		this._container.appendChild(this._rightLabel);

		/**
		 * Onchange handler
		 * @type {Function}
		 */
		this.onchange = function(){};

		//set the position initially
		this.setValue(initialValue || false);
	};

	Toggle.prototype._change = function(e){
		e.preventDefault();
		this._value = !this._value;
		this._update();
		this.onchange(this.getValue());
	};

	Toggle.prototype._update = function(){
		if (this.getValue()){
			this._rightLabel.classList.add("Selected");
			this._leftLabel.classList.remove("Selected");
			this._slider.classList.add("Right");
		} else {
			this._rightLabel.classList.remove("Selected");
			this._leftLabel.classList.add("Selected");
			this._slider.classList.remove("Right");
		}
	};

	Toggle.prototype.setValue = function(val){
		this._value = val;
		this._update();
	};

	Toggle.prototype._setFalse = function(e){
		e.preventDefault();
		this._value = false;
		this._update();		
		this.onchange(this.getValue());
	};

	Toggle.prototype._setTrue = function(e){
		e.preventDefault();
		this._value = true;
		this._update();		
		this.onchange(this.getValue());
	};

	Toggle.prototype.getValue = function(){
		return this._value;
	};

	return Toggle;
});