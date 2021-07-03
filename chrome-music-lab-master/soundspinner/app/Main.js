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

require(["domready", "interface/UserInterface", "main.scss", "mic/Waveform", "mic/Recorder", "mic/Player", 
	"mic/Loader", "StartAudioContext", "Tone/core/Tone", "Tone/source/Microphone"], 
	function(domReady, UserInterface, mainStyle, Waveform, Recorder, Player, Loader, StartAudioContext, Tone, Microphone){

	domReady(function(){
		var recordTime = 3;

		var buttonTimeout  = -1;
		var currentRotation = 0;
		var rotationSpeed = 0;
		var isDragging = false;
		var dragSpeed = 0;
		var computedSpeed = 0;

		//INTERFACE////////////////////////////////////////////////

		var interface = new UserInterface(recordTime * 1000, document.body);

		interface.on("SpeedControllUpdate", function(speed){
			rotationSpeed = speed;
		});

		interface.on("dragRateUpdate", function(drag){
			dragSpeed = (drag * 10);
			// currentRotation += drag;
		});

		interface.on("StartWaveDrag", function(){
			isDragging = true;
		});

		interface.on("EndWaveDrag", function(){
			dragSpeed = 0;
			isDragging = false;
		});

		interface.on("StartRecord", function(drag){
			player.speed = 0;
			player.position = 0;
			recorder.open(function(){
				recorder.start();
				buttonTimeout = setTimeout(function(){
					interface.stopRecording();
					player.setBuffer(recorder.audioBuffer);
				}, recordTime * 1000);
			}, function(e){
				//denied
				window.parent.postMessage("error3","*");
			});
		});

		interface.on("StopRecord", function(drag){
			recorder.stop();
			player.setBuffer(recorder.audioBuffer);
			clearTimeout(buttonTimeout);
		});

		if (!Microphone.supported){
			interface.disableRecording(function(){
				//unsupported
				console.log("unsupported");
				window.parent.postMessage("error2","*");
			});
		}


		//AUDIO////////////////////////////////////////////////

		var recorder = new Recorder(recordTime);

		var twoPI = Math.PI * 2;

		var player = new Player(recordTime);

		var waveform = new Waveform(interface.waveDisplay, recorder);

		function animateIn(){
			//bring everything in
			setTimeout(function(){
				interface.animateIn();
				waveform.animateIn(750);
			}, 100);
		}

		var loader = new Loader(function(buffer){
			recorder.setBuffer(buffer);
			player.setBuffer(buffer);

			window.parent.postMessage("loaded", "*");

			//send the ready message to the parent
			var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

			//full screen button on iOS
			if (isIOS){
				//make a full screen element and put it in front
				var iOSTapper = document.createElement("div");
				iOSTapper.id = "iOSTap";
				document.body.appendChild(iOSTapper);
				new StartAudioContext(Tone.context, iOSTapper).then(function() {
					iOSTapper.remove();
					window.parent.postMessage("ready","*");
				});
			} else {
				animateIn();
				window.parent.postMessage("ready","*");
			}
		});

		//LOOOOOOOOOP////////////////////////////////////////////////
		var lastFrame = -1;

		var rotationQuotient = (Math.PI * 2 / 1000);

		function loop(){
			requestAnimationFrame(loop);
			var speed = rotationSpeed;
			if (isDragging){
				speed = dragSpeed;
			} 
			var alpha = 0.05;

			computedSpeed = alpha * speed + (1 - alpha) * computedSpeed;

			player.speed = computedSpeed;

			if (!recorder.isRecording){
				waveform.setRotation(player.position * Math.PI * 2);
			} else {
				player.speed = 0;
				waveform.setRotation(0);
			}
		}
		loop();

	});
});
