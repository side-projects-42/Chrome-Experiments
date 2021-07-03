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

module.exports = new (function(){
	var _self = this;
	var _MAX_RAD = Math.PI * 2;
	var _RAD_TO_DEGREE = 57.2957795;

	_self.lineDistance = function( point1, point2 ){
		var xs = 0;
		var ys = 0;
		xs = point2.x - point1.x;
		xs = xs * xs;
		ys = point2.y - point1.y;
		ys = ys * ys;
		return Math.sqrt( xs + ys );
	},

	_self.lerp = function( a, b, percent ) { 
		return a + percent * ( b - a ); 
	},

	_self.getAngle = function(centerAxis,point) {
		var rad;
		rad = Math.atan2( 
			point[1]-centerAxis[1],
			point[0]-centerAxis[0]
		);
		rad += _MAX_RAD/4;
		if(rad<0) rad += _MAX_RAD;
		return rad;
	},

	_self.getRadialPoint = function(radius, deg) {
		return [ radius * Math.cos(_MAX_RAD * deg), radius * Math.sin(_MAX_RAD * deg) ];
	};

	_self.pol2cart = function(radius, rads) {
		return [ radius * Math.cos(rads), radius * Math.sin(rads) ];
	};

	_self.getMaxRad = function() {
		return _MAX_RAD;
	},

	_self.convertRadToDegree = function(rad) {
		return rad * _RAD_TO_DEGREE;
	}

})();