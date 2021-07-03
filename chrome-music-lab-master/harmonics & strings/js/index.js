window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var query = window.location.search.slice(1);



// --------------------------------------------------
// Global Constants.
// --------------------------------------------------
// What global mode are we in?
// 0: Harmonics (the wavy things), 1: Strings (plucking strings)
var MODE = 1;

function parseQueryString(){
	var q = window.location.search.slice(1).split('&');
	for(var i=0; i < q.length; ++i){
		var qi = q[i].split('=');
		q[i] = {};
		q[i][qi[0]] = qi[1];
	}
	return q;
}

var q = parseQueryString();
for(var i=0; i < q.length; i++){
	if(q[i].mode != undefined){
		if(Number(q[i].mode) == 1) MODE = Number(q[i].mode);
	}
}

// if(query == "mode=1"){
// 	MODE =1;
// }
// Store PI as global constant.
var MATH_PI = Math.PI;
// How many harmonics to make
var HARMONICS = 6;
// Force mobile testing mode to see how it would behave.
var FORCE_MOBILE_FOR_TESTING = false;
// Top area where we draw waveforms and strings, aspect ratio limits
// so for ultra wide or ultra narrow it doesn't get too spread out or scrunched.
var TOP_ASPECT_RATIO_MAX = 1.3;
var TOP_ASPECT_RATIO_MIN = 0.4;

// --------------------------------------------------
// Global variables
// --------------------------------------------------
// width of the movie
var width, height;
// initialize timer variable and frame counter
var t0, t1;
// first time running resize funciton?
var needToInitializeCanvas = true;
var canvasElement, ctx;
// mobile check
var isMobile; var mobileOS;
// Margins for the overall movie
var leftMargin, rightMargin, topMargin, bottomMargin;
// Aspect ratio of the window - e.g. 1.0 = square, 2.0 = 2:1 horizontal, 0.5 = 1:2 vertical.
var aspectRatio;
// Is user pressing
var isMousePressing = false;
// Used to keep track of active touches.
var currentTouches = new Array;
// Link to main current controller object
var m;

//-------------------------//
// Touch Functions
//-------------------------//
// Finds the array index of a touch in the currentTouches array.
var findCurrentTouchIndex = function (id) {
	for (var i=0; i < currentTouches.length; i++) {
		if (currentTouches[i].id === id) {
			return i;
		}
	}
	// Touch not found! Return -1.
	return -1;
};

// Creates a new touch in the currentTouches array and draws the starting
// point on the canvas.
var touchStarted = function (e) {
	var touches = e.changedTouches;
	for (var i=0; i < touches.length; i++) {
		var touch = touches[i];
		currentTouches.push({
			id: touch.identifier,
			pageX: touch.pageX * 2,
			pageY: touch.pageY * 2,
		});
		// Harmonics mode
		if (MODE == 0) {
			
		// Strings mode
		} else if (MODE == 1) {
			m.createGrabber(false, touch.identifier);
		}
	}
};

// Draws a line on the canvas between the previous touch location and
// the new location.
var touchMoved = function (e) {
	var touches = e.changedTouches;
	// New code
	for (var i=0; i < touches.length; i++) {
		var touch = touches[i];
		var currentTouchIndex = findCurrentTouchIndex(touch.identifier);
		if (currentTouchIndex >= 0) {
			var currentTouch = currentTouches[currentTouchIndex];
			// Update the touch record.
			currentTouch.pageX = touch.pageX * 2;
			currentTouch.pageY = touch.pageY * 2;
			// Store the record.
			currentTouches.splice(currentTouchIndex, 1, currentTouch);
		} else {
			console.log('Touch was not found!');
		}
	}	
};

// Draws a line to the final touch position on the canvas and then
// removes the touh from the currentTouches array.
var touchEnded = function (e) {
	var touches = e.changedTouches;
	// New code
	for (var i=0; i < touches.length; i++) {
		var touch = touches[i];
		var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

		// Harmonics mode
		if (MODE == 0) {
		
		// Strings mode
		} else if (MODE == 1) {
			var g;
			// find the grabber we should destroy
			for (var i = 0; i < m.arrGrabbers.length; i++) {
				g = m.arrGrabbers[i];
				if (g.touchId == touch.identifier) {
					// let go of threads if it's holding any
					g.dropAll();
					m.destroyGrabber(g);
				}
			}
		}

		// Now remove the touch itself
		if (currentTouchIndex >= 0) {
			var currentTouch = currentTouches[currentTouchIndex];
			// Remove the record.
			currentTouches.splice(currentTouchIndex, 1);
		} else {
			console.log('Touch was not found!');
		}
	
	}


};

// Removes cancelled touches from the currentTouches array.
var touchCancelled = function (e) {
	var touches = e.changedTouches;
	for (var i=0; i < touches.length; i++) {
		var currentTouchIndex = findCurrentTouchIndex(touches[i].identifier);
		
		// Harmonics mode
		if (mode == 0) {
		
		// Strings mode
		} else if (mode == 1) {
			var g;
			// find the grabber we should destroy
			for (var i = 0; i < m.arrGrabbers.length; i++) {
				g = m.arrGrabbers[i];
				if (g.touchId == touch.identifier) {
					m.destroyGrabber(g);
				}
			}
		// Wind mode			
		} else if (mode == 2) {

		// Bars mode
		} else {
		
		}	
		
		// Now remove the touch object
		if (currentTouchIndex >= 0) {
			// Remove the touch record.
			currentTouches.splice(currentTouchIndex, 1);
		} else {
			console.log('Touch was not found!');
		}
	}

};

// ----------------------------------------------
// Mouse Functions
// ----------------------------------------------

var xMouse, yMouse;

var mouseDown = function(e) {
	m.mouseDown(e);
	isMousePressing = true;
	xMouse = e.clientX * 2;
	yMouse = e.clientY * 2;			
}

var mouseMove = function(e) {	
	xMouse = e.clientX * 2;
	yMouse = e.clientY * 2;
};

var mouseUp = function(e) {
	m.mouseUp(e);	
	isMousePressing = false;
};

// ----------------------------------------------
// Initialize
// ----------------------------------------------
window.addEventListener('load', function() {

 	// create canvases
	canvasElement = document.getElementById("canvas0");
	ctx = canvasElement.getContext("2d");
	
	// initialize mouse position -- *** might need to look at this later, 
	// as it initializes to the top left corner, the initial mouse down moment
	// might be seen as a giant jump
	xMouse = 0; yMouse = 0;
	
	// Harmonics mode
	if (MODE == 0) {
		// create main object
		m = new HarmonicController();			
	// Strings mode
	} else if (MODE == 1) {
		// create main object
		m = new ThreadController();	
	}
	// run the resize function now
	rsize();	
	// start now
	begin();
});

/**
 * ------------------------------------------------	
 * Update loop run via requestAnimationFrame.
 * ------------------------------------------------	
 */
var render = function() {
	
	t1 = Tone.context.currentTime;
	timeDelta = t1-t0;
	// clear the draw area
	ctx.clearRect(0, 0, width, height);
	// ThreadController object update
	m.upd();
	// increment for the next loop
	t0 = t1;			
	// next frame
	requestAnimFrame(render);
};

/**
 * ------------------------------------------------	
 * Begin dots' warmup before the song begins.
 * ------------------------------------------------	
 */
var begin = function() {
		
	rsize();
	m.begin();
	// Set up an event listener for new touches.
	canvasElement.addEventListener('touchstart', function(e) {
		e.preventDefault();
		touchStarted(event);
	});
	// Set up an event listener for when a touch ends.
	canvasElement.addEventListener('touchend', function(e) {
		e.preventDefault();
		touchEnded(e);
	});
	// Set up an event listener for when a touch leaves the canvas.
	canvasElement.addEventListener('touchleave', function(e) {
		e.preventDefault();
		touchEnded(e);
	});
	// Set up an event listener for when the touch instrument is moved.
	canvasElement.addEventListener('touchmove', function(e) {
		e.preventDefault();
		touchMoved(e);
	});
	// Set up an event listener to catch cancelled touches.
	canvasElement.addEventListener('touchcancel', function(e) {
		e.preventDefault();		
		touchCancelled(e);
	});
	// Mouse events
	canvasElement.addEventListener('mousedown', function(e) {
		e.preventDefault();		
		mouseDown(e);
	});
	// Mouse events
	canvasElement.addEventListener('mousemove', function(e) {
		e.preventDefault();		
		mouseMove(e);
	});
	// Mouse events
	canvasElement.addEventListener('mouseup', function(e) {
		e.preventDefault();		
		mouseUp(e);
	});

	// start the drawing loop.			
	requestAnimFrame(render);  
};
		
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60); // it's not using this, it's just the fallback.
          };
})();

var finishedFile = function(bufferPm) {
  bufferLoader.finishedFile(bufferPm);
};

// ------------------------------------------------------
// Universal functions.
// ------------------------------------------------------
// convert color - rgba format
function getColor(color) {
	var r = Math.round(color[0]);
	var g = Math.round(color[1]);
	var b = Math.round(color[2]);
	var a = (color[3]);
	return 'rgba('+r+','+g+','+b+','+a+')';
}
// convert color - rgba format, but ignore alpha, set to custom alpha
function getColorMinusAlpha(color, alp) {
	var r = Math.round(color[0]);
	var g = Math.round(color[1]);
	var b = Math.round(color[2]);
	var a = alp;
	return 'rgba('+r+','+g+','+b+','+a+')';
}		
// linear extrapolate
function lerp(a, b, t) {
	return a + (b-a)*t;
}
function lerpColor(a, b, t) { 
	var c1 = lerp(a[0], b[0], t);
	var c2 = lerp(a[1], b[1], t);
	var c3 = lerp(a[2], b[2], t);
	var c4 = lerp(a[3], b[3], t);
	return [c1, c2, c3, c4];
}		
// limit to range
function lim(n, n0, n1) {
	if (n < n0) { return n0; } else if (n >= n1) { return n1; } else { return n; }
}
// normalize
var norm = function(a,a0,a1) {
	return (a-a0)/(a1-a0);
}
// return the sign of a number. -1 if negative, 1 if it's zero or positive.
function sign(n) {
	if (n < 0) return -1;
	else return 1;
}

// function:	lim
// desc:		Returns intersection of segement AB and segment EF as Point
// 				Returns null if there is no intersection
// params:      Takes four Points, returns a Point object 
//---------------------------------------------------------------
var lineIntersect = function(A,B,E,F) {
    var ip, a1, a2, b1, b2, c1, c2;
	// calculate
    a1 = B.y-A.y; a2 = F.y-E.y;
	b1 = A.x-B.x; b2 = E.x-F.x;
    c1 = B.x*A.y - A.x*B.y; c2 = F.x*E.y - E.x*F.y;
	// det
    var det=a1*b2 - a2*b1;
	// if lines are parallel
    if (det == 0) { return null; }
	// find point of intersection
    var xip = (b1*c2 - b2*c1)/det;
    var yip = (a2*c1 - a1*c2)/det;
	// now check if that point is actually on both line segments using distance
    if (Math.pow(xip - B.x, 2) + Math.pow(yip - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) { return null; }
    if (Math.pow(xip - A.x, 2) + Math.pow(yip - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) { return null; }
    if (Math.pow(xip - F.x, 2) + Math.pow(yip - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) { return null; }
    if (Math.pow(xip - E.x, 2) + Math.pow(yip - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) { return null; }
	// else it's on both segments, return it
    return new Point(xip, yip);
}
// ------------------------------------------------
// class:			Point
// description:
// ------------------------------------------------
var Point = function(px,py) {
	this.x = px; this.y = py;
}

// When window is resized
function rsize(e) {
  
	var lastWidth = width;
	var lastHeight = height;
  
	width = window.innerWidth * 2;
	height = window.innerHeight * 2;
	// Aspect ratio of the window - e.g. 1.0 = square, 2.0 = 2:1 horizontal, 0.5 = 1:2 vertical.
	aspectRatio = width/height;
	
	// set margins based on that
	leftMargin = rightMargin = width * 0.1;
	topMargin = height * 0.06;
	bottomMargin = height * 0.08;
	// did it not change?
	var isSameSize = (lastWidth == width) && (lastHeight == height);
	// center point
	xCenter = Math.round(width / 2);
	yCenter = Math.round(height / 2);
	// make the canvas objects match window size
	if ((canvasElement != null) && (!isSameSize || needToInitializeCanvas)) {
		if (needToInitializeCanvas) needToInitializeCanvas = false;
		canvasElement.width = window.innerWidth * 2;
		canvasElement.height = window.innerHeight * 2;
		// set line style (for some reason it needed to be done here...)
		ctx.lineCap = 'round';
	}

	m.updateSizeAndPosition();		
}

window.addEventListener('resize', rsize, false);

function iOSBlocker(){
	//full screen button on iOS
	if (isIOS){
		//make a full screen element and put it in front
		var iOSTapper = document.createElement('div');
		iOSTapper.id = 'iOSTap';
		iOSTapper.addEventListener('touchstart', function(e){
			e.preventDefault();
		});
		document.body.appendChild(iOSTapper);
		StartAudioContext.setContext(Tone.context);
		StartAudioContext.on(iOSTapper);
		StartAudioContext.onStarted(function(){
			iOSTapper.remove();
			window.parent.postMessage('ready','*');
		});
	} else {
		window.parent.postMessage('ready','*');
	}
}

if (MODE === 0){
	window.addEventListener('load', function() { 
		//send loaded message, put up an ios blocker
		window.parent.postMessage('loaded', '*');
		iOSBlocker();
	}, false);

} else {
	Tone.Buffer.on('load', function(){
		window.parent.postMessage('loaded', '*');
		iOSBlocker();
	});
}