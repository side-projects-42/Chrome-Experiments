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

define(["jquery", "waveform.scss", "util/MathUtils", "tween.js", "mic/Amplitude"], 
function ($, waveformStyle, MathUtils, TWEEN, Amplitude) {

	var Waveform = function(container, recorder){

		this._container = $("<div>", {
			"id" : "WaveformContainer"
		}).appendTo(container);

		this._canvas = $("<canvas>", {
			"id" : "Waveform"
		}).appendTo(this._container);

		this._context = this._canvas.get(0).getContext("2d");

		this._rotation = 0;

		this._radius = 1;

		this._recorder = recorder;

		this._buffer = recorder.audioBuffer;

		this._resize();
		$(window).on("resize", this._resize.bind(this));

		this._boundDraw = this.draw.bind(this);
		this.draw();
	};

	Waveform.prototype.setRotation = function(rot){
		this._rotation = rot - Math.PI / 2;
	};

	Waveform.prototype.animateIn = function(delay){
		
	};

	Waveform.prototype._resize = function(){
		var min = Math.min(this._container.width(), this._container.height());
		this._canvas.width(min);
		this._canvas.height(min);
		this._context.canvas.width = min * 2;
		this._context.canvas.height = min * 2;

		this._centerX = min;
		this._centerY = min;
	};

	var twoPi = Math.PI * 2;

	Waveform.prototype.draw = function(){
		requestAnimationFrame(this._boundDraw);
		TWEEN.update();

		if (this._radius === 0){
			return;
		}

		var radius = this._centerX * 0.8 * this._radius;

		var array = this._buffer.getChannelData(0);				

		var context = this._context;
		context.clearRect(0, 0, this._centerX * 2, this._centerY * 2);

		context.save();
		context.translate( this._centerX, this._centerY );
		context.rotate( this._rotation );

		//drawing
		context.strokeStyle = "#FFB729";
		context.lineCap = "round";
		
		var numSlices = 500;
		var stopPosition = numSlices;
		if (this._recorder.isRecording){
			stopPosition = numSlices * this._recorder.position;
		}
		var chunkSize = array.length / numSlices;
		var maxHeight = this._centerX * 0.2;
		var lastSample = 0;
		context.lineWidth = (this._centerX / numSlices) * 7;
		context.beginPath();
		
		for (var theta = 0; theta < numSlices; theta++){
			if (theta > stopPosition){
				break;
			}
			var radians = (theta / numSlices) * twoPi;
			var amp = Math.abs(array[Math.floor(theta * chunkSize)]);
			amp = Math.pow(amp, 0.5);
			amp = Math.max(lastSample * 0.2, amp);
			lastSample = amp;
			amp *= maxHeight;
			amp = Math.max(amp, 0.01);
			var startPos = MathUtils.pol2cart(radius - amp, -radians);
			var endPos = MathUtils.pol2cart(radius + amp, -radians);
			context.moveTo(startPos[0], startPos[1]);
			context.lineTo(endPos[0], endPos[1]);
		}
		context.stroke();

		context.translate( -this._centerX, -this._centerY );
		context.restore();

		Amplitude.draw(this._context, this._centerX, this._centerY - radius, maxHeight);

	};

	return Waveform;
});