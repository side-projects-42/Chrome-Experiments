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

define(["Tone/source/Microphone", "Tone/core/Tone"], function (Microphone, Tone) {

	/**
	 *  the recorder
	 */
	var Recorder = function(bufferDuration){

		/**
		 *  the mic input
		 *  @type  {Tone.Microphone}
		 */
		this.mic = new Microphone();

		/** 
		 *  @private
		 *  @type {ScriptProcessorNode}
		 */
		this.jsNode = Tone.context.createScriptProcessor(4096, 1, 1);
		//so it doesn't get garbage collected
		this.jsNode.noGC();

		this.mic.connect(this.jsNode);

		/**
		 *  The buffer to record into
		 */
		this.audioBuffer = Tone.context.createBuffer(1, Tone.context.sampleRate * bufferDuration, Tone.context.sampleRate);

		/**
		 *  the array to record into
		 */
		this.bufferArray = this.audioBuffer.getChannelData(0);

		/**
		 *  the position of the recording head within the buffer
		 */
		this.bufferPosition = 0;

		/**
		 * the normalized position of the recording head
		 */
		this.position = 0;

		/**
		 *  if it's recording or not
		 */
		this.isRecording = false;

		/**
		 * the duraiton
		 */
		this._bufferDuration = bufferDuration;

		 /**
		  *  the callback when it's done recording
		  */
		 this.onended = Tone.noOp;
	};

	/**
	 *  start the microphone
	 */
	Recorder.prototype.open = function(callback, err) {
		this.jsNode.onaudioprocess = this._onprocess.bind(this);
		this.mic.open(callback, err);
	};

	/**
	 *  record the input
	 */
	Recorder.prototype.start = function() {
		//0 out the buffer
		for (var i = 0; i < this.bufferArray.length; i++){
			this.bufferArray[i] = 0;
		}
		this.bufferPosition = 0;
		this.isRecording = true;
		this.mic.start();
	};

	/**
	 *  stop recording
	 */
	Recorder.prototype.stop = function() {
		//blank callback
		this.mic.close();
		this.jsNode.onaudioprocess = function(){};
		this.isRecording = false;
	};

	/**
	 *  the audio process event
	 */
	Recorder.prototype._onprocess = function(event){
		//meter the input
		var bufferSize = this.jsNode.bufferSize;
		// var smoothing = 0.3;
		var input = event.inputBuffer.getChannelData(0);
		var x;
		var recordBufferLen = this.bufferArray.length;
		for (var i = 0; i < bufferSize; i++){
			x = input[i];
	    	// sum += x * x;
			//if it's recording, fill the record buffer
			if (this.isRecording){
				if (this.bufferPosition < recordBufferLen){
					this.bufferArray[this.bufferPosition] = x;
					this.bufferPosition++;
				} else {
					this.stop();
					//get out of the audio thread
					setTimeout(this.onended.bind(this), 5);
				}
			}
		}
		this.position = this.bufferPosition / recordBufferLen;
		// var rms = Math.sqrt(sum / bufferSize);
		// this.meter = Math.max(rms, this.meter * smoothing);
	};

	Recorder.prototype.setBuffer = function(buffer){
		var targetArray = this.audioBuffer.getChannelData(0);
		var copyArray = buffer.getChannelData(0);
		for (var i = 0; i < copyArray.length; i++){
			targetArray[i] = copyArray[i];
		}
	};

	return Recorder;
});