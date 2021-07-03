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

define(["Tone/event/Sequence", "Tone/core/Transport", "sound/Player"], 
	function (Sequence, Transport, Player) {

	var Arp = function(delayTime, lowestNote, highestNote){

		this.delayTime = delayTime;

		/**
		 * The notes to play
		 * @type {Array}
		 * @private
		 */
		this._notes = [];

		this.seq = new Sequence(this._tick.bind(this), [Infinity, 0, 1, 2], delayTime).start(0);
		this.seq.loop = false;

		this.player = new Player("https://gweb-musiclab-site.appspot.com/static/sound/piano", lowestNote, highestNote, 3);
	};

	Arp.prototype.stop = function(){
		Transport.stop();
	};

	Arp.prototype.play = function(notes){
		if (Transport.state === "started"){
			Transport.ticks = 0;
		}
		this._notes = notes;
		Transport.start();
	};

	Arp.prototype.load = function(cb){
		this.player.load();
		this.player.onload = cb;
	};

	Arp.prototype._tick = function(time, index){
		if (this._notes.length > index){
			if (this.player.loaded){
				this.player.triggerAttackRelease(this._notes[index], this.delayTime * 2.5, time);
			}
		}
	};

	return Arp;
});