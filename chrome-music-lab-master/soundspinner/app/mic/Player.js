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

define(["Tone/core/Tone", "util/MathUtils", "mic/Amplitude"], function (Tone, MathUtils, Amplitude) {

	var Player = function(bufferDuration){

		/** 
		 *  @private
		 *  @type {ScriptProcessorNode}
		 */
		this._jsNode = Tone.context.createScriptProcessor(2048, 0, 1);
		//so it doesn't get garbage collected
		this._jsNode.toMaster();
		this._jsNode.onaudioprocess = this._process.bind(this);

		this._buffer = Tone.context.createBuffer(1, Tone.context.sampleRate * bufferDuration, Tone.context.sampleRate);

		this._playbackPosition = 0;

		this.speed = 0;

		this.position = 0;
	};

	Player.prototype.setBuffer = function(buffer){
		this._buffer = Tone.context.createBuffer(1, Tone.context.sampleRate * buffer.duration, Tone.context.sampleRate);
		var targetArray = this._buffer.getChannelData(0);
		var copyArray = buffer.getChannelData(0);
		for (var i = 0; i < copyArray.length; i++){
			targetArray[i] = copyArray[i];
		}
		this._playbackPosition = 0;
		this.position = 0;
	};

	Player.prototype._process = function(e){

		var outputBuffer = e.outputBuffer.getChannelData(0);
		var frameLength = outputBuffer.length;

		var sum = 0;

		if (Math.abs(this.speed) > 0.08){

			var samples = this._buffer.getChannelData(0);
			var sampleLen = samples.length;

			var startSamples = this._playbackPosition;
			var endSamples = this.speed * outputBuffer.length + startSamples;
			this._playbackPosition = endSamples;

			this.position = (this._playbackPosition / sampleLen);

			for (var i = 0, len = outputBuffer.length; i < len; i++){

				var pos = MathUtils.lerp(startSamples, endSamples, i / len);
				var lowPos = Math.floor(pos) % sampleLen;
				if (lowPos < 0){
					lowPos = sampleLen + lowPos;
				}

				var highPos = Math.ceil(pos) % sampleLen;
				if (highPos < 0){
					highPos = sampleLen + highPos;
				}

				pos = pos % sampleLen;
				if (pos < 0){
					pos = sampleLen + pos;
				}

				//lerp the sample if between samples
				sample = MathUtils.lerp(samples[lowPos], samples[highPos], pos - lowPos);

				sum += sample * sample;

				//set the sample
				outputBuffer[i] = sample;
			}

		} else {
			//all 0s
			for (var j = 0; j < frameLength; j++){
				outputBuffer[j] = 0;
			}
		}
		Amplitude.setRMS(sum / frameLength);
	};

	return Player;
});