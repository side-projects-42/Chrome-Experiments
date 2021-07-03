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


'use strict';

// Events:
// SpeedControllUpdate
// Play
// Pause
// Resize
// StartRecord
// StopRecord
var MathUtils = require('util/MathUtils');
var $ = require('jquery');
var controlsStyle = require('controls.scss');
var Slider = require('interface/Slider');
var OrientationChange = require('interface/Orientation');

module.exports = function(maxRecordTime, container) {

	var _self = this;
		_self.speedSlider 		= undefined;
		_self.bindings 			= {};
		_self.waveDisplayDrag 	= false;
		_self.needsUpdate 		= false;
		_self.ploc 				= undefined;
		_self.slideZeroLock		= 0.1;
		_self.smoothedRotation = 0;

	_self.init = function() {
		_self.attachControls();
		_self.attachEvents();
		//start the update
		_self.update();
	},

	_self.attachControls = function() {
		// _self.precisionSlider 	= $("#precisionSlider");
		_self.waveDisplay 	= $('<div>').prop('id', 'WaveDisplay').appendTo(container);
		_self.recordButton 	= $('<div>').prop('id', 'RecordButton').appendTo(_self.waveDisplay);
		_self.recordButton.addClass("icon-svg_record");

		// _self.speedSliderContainer = $("<div>").prop("id", "SliderContainer").appendTo(container);

		// _self.speedSlider 	= $('<input>').prop('id', 'SpeedSlider').appendTo(_self.speedSliderContainer)
		// 	.prop("type", "range").prop("min", "-2").prop("max", 2).prop("step", "0.01").prop("value", 0);

		_self.speedSlider = new Slider(container, -2, 2, 0);

		_self.oreitnationListener = new OrientationChange(function(){
			_self.speedSlider.setValue(0);
			_self.doEvent('SpeedControllUpdate',0);
			_self.doEvent('EndWaveDrag');
		});
	},

	_self.disableRecording = function(callback) {
		_self.recordButton.addClass('disabled');
		_self.recordButton.removeClass("icon-svg_record");
		_self.recordButton.addClass("icon-svg_no_record");
		_self.recordButton.on("click", function(e){
			e.preventDefault();
			callback();
		});
	},

	_self.animateIn = function(callback) {
		_self.recordButton.addClass("Visible");
		_self.speedSlider.animateIn();
	},

	_self.stopRecording = function(){
		_self.recordButton.removeClass('recording');
	},


	_self.attachEvents = function() {
		_self.speedSlider.onchange = function(val){
			_self.doEvent('SpeedControllUpdate',val);
		};

		_self.recordButton.on("click", function(e){
			e.preventDefault();
			
			if(_self.recordButton.hasClass('disabled')) return false;

			if(_self.recordButton.hasClass('recording')){
				_self.doEvent('StopRecord',e);
				_self.stopRecording();
			}else{
				_self.doEvent('StartRecord',e);
				_self.recordButton.addClass('recording');
			}
			return false;
		}).on("mousedown touchstart", function(e){
			// e.preventDefault();
			e.stopPropagation();
		});

		/*_self.playButton.click(function(e){
			_self.doEvent('Play',e);
			_self.playButton.hide(0);
			_self.pauseButton.show(0);
			return false;
		});
		_self.pauseButton.click(function(e){
			_self.doEvent('Pause',e);
			_self.playButton.show(0);
			_self.pauseButton.hide(0);
			return false;
		});*/

		_self.waveDisplay.on("mousedown",_self.mouseDown);
		_self.waveDisplay.on("touchstart",_self.mouseDown);
		_self.waveDisplay.on("touchmove",_self.setMousePosition);
		$(window).on("mouseup",_self.mouseUp);
		$(window).on("touchend",_self.mouseUp);

		$(window).on("blur", function() {
            _self.speedSlider.setValue(0);
            _self.doEvent('SpeedControllUpdate', 0);
		});
		
		$(window).resize(function(e){
			_self.doEvent('ReizeWindow',[$(window).width(),$(window).height()]);
		});
	},

	_self.setSliderValue = function(val) {
		// _self.speedSlider[0].value = val;
	},

	_self.mouseDown = function(e){
		_self.waveDisplayDrag = true;
		_self.needsUpdate = true;
		_self.pRad = MathUtils.getAngle(_self.getViewCenter(),[e.pageX,e.pageY]);
		_self.pLoc =[e.pageX,e.pageY];
		_self.setMousePosition(e);
		_self.waveDisplay.mousemove(_self.setMousePosition);
		_self.doEvent('StartWaveDrag',e);
		return false;
	},
	
	_self.mouseUp = function(e){
		_self.waveDisplayDrag = false;
		_self.needsUpdate = false;
		_self.waveDisplay.off('mousemove');
		_self.smoothedRotation = 0;
		_self.doEvent('EndWaveDrag',e);
	},

	_self._updateSmoothRotation = function(newVal){
		var alpha = 0.1;
		_self.smoothedRotation = newVal * alpha + _self.smoothedRotation * (1 - alpha);
		if (Math.abs(_self.smoothedRotation) < 0.005){
			_self.smoothedRotation = 0;
		}
	},
	
	_self.setMousePosition = function(e) {
		if(e.type === 'touchmove'){
			_self.mousePos = [e.originalEvent.targetTouches[0].pageX,e.originalEvent.targetTouches[0].pageY];
		}else{
			_self.mousePos = [e.pageX,e.pageY];	
		}
		_self.needsUpdate = true;
	},

	_self.getViewCenter = function() {
		return [$(container).width() * 0.5,  $(container).height() * 0.5];
	},

	_self.rotationDragUpdate = function() {
		var cRad = MathUtils.getAngle(_self.getViewCenter(),_self.mousePos);
		var rotMax = 0.5;
		if(_self.mousePos[0] == _self.pLoc[0] && _self.mousePos[1] == _self.pLoc[1]) {
			_self._updateSmoothRotation(0);
			_self.doEvent('dragRateUpdate',0);
			return false;
		}
		if(_self.pRad != cRad) {
			var relRad = _self.pRad - cRad;
			var rotation = _self.pRelRad + relRad;
			if( isNaN(rotation) ) rotation = 0;
			if( rotation < -rotMax)rotation = _self.pRotation;
			if( rotation > rotMax)rotation = _self.pRotation;
			_self._updateSmoothRotation(-rotation);
			_self.doEvent('dragRateUpdate',_self.smoothedRotation);
		}else {
			_self._updateSmoothRotation(0);
			_self.doEvent('dragRateUpdate',0);
		}

		_self.pRad = cRad;
		_self.pLoc = _self.mousePos;
		_self.pRelRad = relRad;
		_self.pRotation = rotation;

	},
	
	_self.update = function() {
		requestAnimationFrame(_self.update);
		if(_self.needsUpdate == false) return false;		
		_self.rotationDragUpdate();
	},

	_self.on = function(binding,callback) {
		
		if(_self.bindings[binding] == undefined) {
			_self.bindings[binding] = [];
		}
		_self.bindings[binding].push(callback);
	},

	_self.doEvent = function(binding, result) {
		if(_self.bindings[binding] == undefined ) return false;
		for(var i=0; i <  _self.bindings[binding].length; ++i){
			_self.bindings[binding][i](result);
		}
	},

	_self.init();
};