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

define(["keyboard/Key", "style/keyboard.scss", "keyboard/Notes", "data/Colors"], function(Key, mainStyle, Notes, Colors){

	var enharmonics = {
		"C#" : "Db",
		"D#" : "Eb",
		"F#" : "Gb", 
		"G#" : "Ab", 
		"A#" : "Bb"
	};


	/**
	 * @class Create a new piano keyboard.
	 * @param {Element} container The container to put the piano
	 * @param {String=} start The lowest note on the keyboard
	 * @param {String=} end The highest note on the keyboard
	 */
	var Piano = function(container, start, end){

		/**
		 * The canvas
		 * @type {Element}
		 * @private
		 */
		this._canvas = document.createElement("canvas");
		this._canvas.id = "PianoKeyboard";
		container.appendChild(this._canvas);

		/**
		 * The drawing context
		 * @type {Context2D}
		 * @private
		 */
		this._context = this._canvas.getContext("2d");

		/**
		 * The container of the canvas
		 * @type {Element}
		 * @private
		 */
		this._container = container;

		/**
		 * The lowest note on the keyboard
		 * @type {String}
		 * @private
		 */
		this._startNote = start || "C4";

		/**
		 * The highest note on the keyboard
		 * @type {String}
		 * @private
		 */
		this._endNote = end || "C6";

		/**
		 * The array of note names
		 * @private
		 * @type {Array}
		 */
		this._notes = [];

		/**
		 * an object mapping note names to note objects
		 * @type {Object}
		 * @private
		 */
		this._noteNames = {};

		/**
		 * Indicates if the mouse is currently down
		 * @type {Boolean}
		 * @private
		 */
		this._isMouseDown = false;

		/**
		 * Flag if the touch was moved
		 * @type {Boolean}
		 * @private
		 */
		this._touchDragged = false;

		/**
		 * Flag if the context started callback
		 * was invoked.
		 * @type {Boolean}
		 * @private
		 */
		this._contextStarted = false;

		/**
		 * The highlighted keys
		 * @type {Array}
		 * @private
		 */
		this._highlightedKeys = [];

		/**
		 * the highlight color
		 * @type {String}
		 * @private
		 */
		this._highlightColor = "#FFB729";

		//listen for changes in the size of the container
		window.addEventListener("resize", this._resize.bind(this));
		//events
		this._canvas.addEventListener("mousedown", this._mouseDown.bind(this));
		this._canvas.addEventListener("mousemove", this._mouseMove.bind(this));
		this._canvas.addEventListener("mouseup", this._mouseUp.bind(this));
		this._canvas.addEventListener("mouseleave", this._mouseLeave.bind(this));
		this._canvas.addEventListener("touchstart", this._touchStart.bind(this));
		this._canvas.addEventListener("touchend", this._touchEnd.bind(this));
		this._canvas.addEventListener("touchmove", this._touchMove.bind(this));

		//size the container initially
		this._makeKeys();
		this._resize();

		//callback events
		this.onkeydown = function(){};
		this.onkeyup = function(){};

		//callback if the context can be started
		this.oncontextstart = function(){};
	};

	/**
	 * resize the canvas
	 * @private
	 */
	Piano.prototype._resize = function(){
		this._context.canvas.width = this._container.clientWidth * 2;
		this._context.canvas.height = this._container.clientHeight * 2;
		this.draw();
	};

	/**
	 * Force a redraw of the piano
	 * @return {Piano} this
	 */
	Piano.prototype.draw = function(){
		var width = this._context.canvas.width;
		var height = this._context.canvas.height;

		var lineWidth = 2;
		this._context.lineWidth = lineWidth;

		//clear the previous one
		this._context.clearRect(0, 0, width, height);

		this._context.strokeStyle = Colors.lightGrey;

		var span = Notes.getDistanceBetween(this._startNote, this._endNote);
		var keyWidth = width / span;
		var key;
		//draw the white keys
		for (var i = 0; i < this._keys.length; i++){
			key = this._keys[i];
			if (!key.isSharp){
				key.draw(this._context, keyWidth, height);
			}
		}
		//draw the black keys
		for (var j = 0; j < this._keys.length; j++){
			key = this._keys[j];
			if (key.isSharp){
				key.draw(this._context, keyWidth, height);
			}
		}

		//draw the overal2;
		this._context.beginPath();
		this._context.lineWidth = lineWidth * 2;
		this._context.rect(0, 0, width, height);
		this._context.stroke();
		return this;
	};

	/**
	 * Test for collisions
	 */
	Piano.prototype._getCollision = function(x, y){
		var span = Notes.getDistanceBetween(this._startNote, this._endNote);
		var width = this._context.canvas.width / span;
		var height = this._context.canvas.height;
		x  = x * 2 / width;
		y = y * 2 / height;
		var key;
		var collidedKey;
		//draw the white keys
		for (var i = 0; i < this._keys.length; i++){
			key = this._keys[i];
			if (key.isSharp){
				if (key.testCollision(x, y)){
					collidedKey = key;
					break;
				}
			}
		}
		if (!collidedKey){
			//test the white keys
			for (var j = 0; j < this._keys.length; j++){
				key = this._keys[j];
				if (!key.isSharp){
					if (key.testCollision(x, y)){
						collidedKey = key;
						break;
					}
				}
			}
		}
		return collidedKey;
	};

	/**
	 * Make all the keys
	 */
	Piano.prototype._makeKeys = function(){
		this._notes = Notes.getNotes(this._startNote, this._endNote);
		this._keys = [];
		for (var i = 0; i < this._notes.length; i++){
			var note = this._notes[i];
			var key = new Key(note, Notes.getDistanceBetween(this._startNote, note));
			this._noteNames[note] = key;
			var sharpedNote = note.substr(0, 2);
			if (enharmonics.hasOwnProperty(sharpedNote)){
				var octave = note.substr(2);
				this._noteNames[enharmonics[sharpedNote] + octave] = key;
			}
			this._keys.push(key);
		}
		return this;
	};

	///////////////////////////////////////////////////////////////////////////
	// MOUSE EVENTS
	///////////////////////////////////////////////////////////////////////////

	Piano.prototype._mouseDown = function(e){
		//test collisions
		e.preventDefault();
		var key = this._getCollision(e.offsetX, e.offsetY);
		this._isMouseDown = true;
		if (key){
			this._highlightedKeys.push(key);
			this.onkeydown(key.note);
		}
	};

	Piano.prototype._mouseUp = function(e){
		//test collisions
		e.preventDefault();
		var key = this._getCollision(e.offsetX, e.offsetY);
		this._isMouseDown = false;
		if (key){
			this._highlightedKeys.splice(this._highlightedKeys.indexOf(key), 1);
			this.onkeyup(key.note);
		}
	};

	Piano.prototype._mouseLeave = function(e){
		//test collisions
		e.preventDefault();
		this._isMouseDown = false;
		for (var i = 0; i < this._highlightedKeys.length; i++){
			this.onkeyup(this._highlightedKeys[i].note);
		}
		this._highlightedKeys = [];
	};

	Piano.prototype._mouseMove = function(e){
		if (this._isMouseDown){
			e.preventDefault();
			var key = this._getCollision(e.offsetX, e.offsetY);
			//if it's not already down
			if (this._highlightedKeys.indexOf(key) === -1){
				//unhighlight the current key
				for (var i = 0; i < this._highlightedKeys.length; i++){
					this.onkeyup(this._highlightedKeys[i].note);
				}
				this._highlightedKeys = [];
				if (key){
					this._highlightedKeys.push(key);
					this.onkeydown(key.note);
				}
			}
		}
	};

	Piano.prototype._touchStart = function(e){
		e.preventDefault();
		var parentOffset = this._container.getBoundingClientRect();
		var touches = e.changedTouches;
		for (var i = 0; i < touches.length; i++){
			var touch = touches[i];
			var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
			if (key){
				this._highlightedKeys.push(key);
				this.onkeydown(key.note);
			}			
		}
		this._touchDragged = false;
	};

	Piano.prototype._touchEnd = function(e){
		e.preventDefault();
		var parentOffset = this._container.getBoundingClientRect();
		var touches = e.changedTouches;
		for (var i = 0; i < touches.length; i++){
			var touch = touches[i];
			var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
			if (key){
				this._highlightedKeys.splice(this._highlightedKeys.indexOf(key), 1);
				this.onkeyup(key.note);
			}			
		}
		if (!this._touchDragged && !this._contextStarted){
			this._contextStarted = true;
			this.oncontextstart();
		}
	};

	Piano.prototype._touchMove = function(e){
		e.preventDefault();
		var parentOffset = this._container.getBoundingClientRect();
		var touches = e.changedTouches;
		for (var i = 0; i < touches.length; i++){
			var touch = touches[i];
			var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
			//if it's not already down
			if (this._highlightedKeys.indexOf(key) === -1){
				//unhighlight the current key
				for (var j = 0; j < this._highlightedKeys.length; j++){
					this.onkeyup(this._highlightedKeys[j].note);
				}
				this._highlightedKeys = [];
				if (key){
					this._highlightedKeys.push(key);
					this.onkeydown(key.note);
				}
			}	
		}
		//flag that the touch moved
		this._touchDragged = true;
	};

	///////////////////////////////////////////////////////////////////////////
	// SETTERS
	///////////////////////////////////////////////////////////////////////////

	/**
	 * Set the highlight color. "rainbow" will use the 
	 * colored keyboard palette. 
	 * @param {String} color
	 * @return {Piano} this
	 */
	Piano.prototype.setHighlightColor = function(color){
		this._highlightColor = color;
		this._keys.forEach(function(key){
			key.setHighlightColor(color);
		});
		this.draw();
		return this;
	};

	/**
	 * Set the lowest note on the keyboard
	 * @param {String} startNote
	 * @return {Piano} this
	 */
	Piano.prototype.setStartNote = function(startNote){
		this._startNote = startNote;
		this._makeKeys();
		this.draw();
		return this;
	};

	/**
	 * Set the highest note on the keyboard
	 * @param {String} endNote
	 * @return {Piano} this
	 */
	Piano.prototype.setEndNote = function(endNote){
		this._endNote = endNote;
		this._makeKeys();
		this.draw();
		return this;
	};

	///////////////////////////////////////////////////////////////////////////
	// HIGHLIGHTING
	///////////////////////////////////////////////////////////////////////////

	Piano.prototype.keyDown = function(note){
		if (Array.isArray(note)){
			for(var i = 0; i < note.length; i++){
				this.keyDown(note[i]);
			}
		} else if (this._noteNames.hasOwnProperty(note)){
			this._noteNames[note].highlight(this._highlightColor);
		}
		this.draw();
	};

	Piano.prototype.highlight = function(note, whiteColor, blackColor){
		if (Array.isArray(note)){
			for(var i = 0; i < note.length; i++){
				this.highlight(note[i]);
			}
		} else if (this._noteNames.hasOwnProperty(note)){
			var key = this._noteNames[note];
			if (key.isSharp){
				this._noteNames[note].highlight( blackColor || Colors.lightGrey);
			} else {
				this._noteNames[note].highlight( whiteColor || "black");
			}
		}
		this.draw();
	};

	Piano.prototype.keyUp = function(note){
		if (Array.isArray(note)){
			for(var i = 0; i < note.length; i++){
				this.keyUp(note[i]);
			}
		} else if (this._noteNames.hasOwnProperty(note)){
			this._noteNames[note].unhighlight();
		}
		this.draw();
	};

	Piano.prototype.unselectAll = function(){
		for (var j = 0; j < this._keys.length; j++){
			this._keys[j].unhighlight();
		}
		this.draw();
	};

	return Piano;
});