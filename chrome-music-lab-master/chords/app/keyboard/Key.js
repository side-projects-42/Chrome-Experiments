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

define(["data/Colors"], function (Colors) {

	"use strict";

	/**
	 * @class Represents a single key
	 * @param {HTML Canvas}
	 * @param {String} note
	 * @param {String} startNote
	 * @param {String} endNote
	 */
	var Key = function(note, offset){

		/**
		 * The note
		 * @type {String}
		 * @private
		 */
		this.note = note;

		/**
		 * The key offset between the start note
		 * and this note
		 * @type {Number}
		 * @private
		 */
		this._offset = offset;

		/**
		 * The key offset between the start note
		 * and this note
		 * @type {Number}
		 * @private
		 */
		this.isSharp = this.note.indexOf("#") !== -1;

		/**
		 * If the note is highlighted or not
		 * @type {Boolean}
		 * @private
		 */
		this._isHighlighted = false;

		/**
		 * The highlight color
		 * @type {String}
		 * @private
		 */
		this._highlightColor = "";

		//defaults to rainbow
		this.setHighlightColor("rainbow");

		this._computeBoundingBox();
		//listen for mouse and touch events
		// this._canvas.on("mousedown", this._mousedown.bind(this));
	};

	/**
	 * returns an array of [left, top, width, height] for the note
	 */
	Key.prototype._computeBoundingBox = function(){
		var noteHeight = this.isSharp ? 0.6 : 1;
		var noteWidth = this.isSharp ? 0.7 : 1;
		var offset = this.isSharp ? (1 - noteWidth) / 2 : 0;
		return [this._offset + offset, 0, noteWidth, noteHeight];
	};

	/**
	 * The pitch of the note
	 * @return {String}
	 * @private
	 */
	Key.prototype._getNoteName = function(){
		var parts = this.note.split(/(-?\d+)/);
		if (parts.length === 3){
			var noteName = parts[0].toUpperCase();
			return noteName;
		}
	};

	/**
	 * Mark the key as highlighted
	 * @param  {String} color, set the highlight color
	 * @return {Key} this
	 */
	Key.prototype.highlight = function(color){
		this._isHighlighted = true;
		this._highlightColor = color;
		return this;
	};

	/**
	 * Unhighlight the key
	 * @return {Key} this
	 */
	Key.prototype.unhighlight = function(){
		this._isHighlighted = false;
		return this;
	};

	/**
	 * Set the highlight color of the note
	 * @param {String}
	 */
	Key.prototype.setHighlightColor = function(color){
		if (color === "rainbow"){
			this._highlightColor = Colors[this._getNoteName()];
		} else {
			this._highlightColor = color;
		}
		return this;
	};

	/**
	 * Set the lowest note on the piano
	 * @param {String}
	 */
	Key.prototype.setStartNote = function(startNote){
		this._startNote = startNote;
		this._computeBoundingBox();
	};

	/**
	 * Set the highest note on the piano
	 * @param {String}
	 */
	Key.prototype.setEndNote = function(endNote){
		this._endNote = endNote;
		this._computeBoundingBox();
	};

	/**
	 * Test if coords intersect with this key
	 */
	Key.prototype.testCollision = function(x, y){
		var box = this._computeBoundingBox();
		if (box[0] <= x && box[0] + box[2] >= x && box[1] <= y && box[3] >= y){
			return true;
		}
	};

	/**
	 * Draw the note on the context
	 * @return {Key} this
	 */
	Key.prototype.draw = function(context, width, height){
		context.beginPath();
		if (this._isHighlighted){
			context.fillStyle = this._highlightColor;
		} else {
			context.fillStyle = this.isSharp ? Colors.charcoal : "white";
		}
		var box = this._computeBoundingBox();
		box[0] = Math.round(width * box[0]);
		box[2] = Math.round(width * box[2]);
		box[1] = Math.round(height * box[1]);
		box[3] = Math.round(height * box[3]);
		context.rect.apply(context, box);
		context.fill();
		if (!this.isSharp && !this._isHighlighted){
			context.stroke();
		}
		return this;
	};

	return Key;
});