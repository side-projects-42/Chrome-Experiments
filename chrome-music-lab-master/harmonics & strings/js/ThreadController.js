// class:	ThreadController
// desc:
// ------------------------------------------------	
var ThreadController = function() {

	// ----------------
	// variables
	// ----------------
	// my main canvas object
	this.cv; this.cvo;
	// array of Thread objects
	this.arrThreads = new Array();
	// array of player objects
	this.arrPlayers = new Array();
	// array of thread grabber objects
	this.arrGrabbers = new Array();
	// array of thread positions, x-y coordinates for start and end
	this.arrThreadPositions = new Array();
	// How many total strings will we create?
	// We create only one for the first harmonic, then two for each after that.
	this.totalThreads = ((HARMONICS - 1) * 2) + 1;
	// Color and radius size of nodes
	this.nodeColor = [102, 102, 102, 1]; // RGBA
	this.nodeRadius = 5 * 2;
	// Color of the little tick strokes
	this.tickColor = [147, 203, 209, 1]; // RGBA
	this.tickStrokeSize = 3 * 2;
	this.tickSize = 10 * 2;
	// thread counter
	this.threadCt = 0;
	// how many strings grabbed
	this.grabbed = 0;
	//
	this.isMouseDown = false;
	// my upper left corner position
	this.xp; this.yp;
	// width and height of the bounding box drawing area of each harmonic
	this.boxWidth; this.boxHeight;	
	// user speed low limit where we can grab and hold string (as ratio)
	this.rSpdGrab = 0.1;
	// distance to travel (pixels) when we're considered at min/max speed
	// this.distMin = 10; this.distMax = 70;
	// min and max speed, when to cap it - pixels per millisecond
	this.spdMin = 70; this.spdMax = 1500;
	// min max speed as a ratio
	this.rSpd = 0;
	// average speed over the past few frames
	this.rSpdAvg = 0;
	// how many frames to make average
	this.fAvg = 5;
	// user speed low limit where we can grab and hold string (as ratio)
	this.rSpdGrab = 0.4;
	// mouse position
	this.xp0=0; this.yp0=0;
	this.xp1=0; this.yp1=0;
	// mouse position as point objects
	this.pt0 = new Point();
	this.pt1 = new Point();
	// Draw me for debug mode
	this.isDebugDrawingOn = false;
	// Grabber object linked to mouse
	this.grabberMouse;
	
	// offset all of the above arrNoteLength values by this (where the first note starts)
	this.tNoteOff = 0;
	// initialize
	this.init();
}

// function:	init
// desc:
// ------------------------------------------------	
ThreadController.prototype.init = function() {
	
	// canvas
	this.cv = ctx;
	// Sound
	var player, segment, howMany, filename;
	for (var h = 0; h < HARMONICS; h++) {
		this.arrPlayers[h] = new Array(2);
		howMany = h == 0 ? 1 : 2;
		// Make one for the top part of the string, one for bottom.
		for (var i = 0; i < howMany; i++) {
			segment = (i == 0) ? "top" : "bottom";
			player = new Tone.Player("./audio/harp_" + h + "_" + segment + ".mp3").toMaster();
			player.retrigger = true; // allow it to be played and layered
			player.volume.value = -9.0;
			this.arrPlayers[h][i] = player;
		}
	}
	// Create an array to store the x-y positions of threads.
	// For each string, from left to right, we have store [[startX, startY], [endX, endY]]
	for (var i = 0; i < this.totalThreads; i++) {
		this.arrThreadPositions[i] = new Array(2);
		this.arrThreadPositions[i][0] = new Array(2);
		this.arrThreadPositions[i][1] = new Array(2);
	}
	// Do the math to set their positions
	this.setThreadPositions();
	var x0, y0, x1, y1, isTop;
	// Now go through and create the objects themselves	
	// Go through all the harmonics (e.g. six across)
	for (var h = 0; h < HARMONICS; h++) {
		// There are two strings for each harmonic, except the first one.
		howMany = h == 0 ? 1 : 2;
		// Create two strings for each harmonic
		for (var i = 0; i < howMany; i++) {	
			// We make the top string first
			isTop = (i == 0);
			// Get the positions
			x0 = this.arrThreadPositions[i][0][0];
			y0 = this.arrThreadPositions[i][0][1];
			x1 = this.arrThreadPositions[i][1][0];
			y1 = this.arrThreadPositions[i][1][1];
			// Create the thread. The parameters are:
			// start x, start y, end x, end y, thread index number, harmonic index number, 
			// isTop: whether it's top or bottom, then link to this object
			var thr = new Thread(x0, y0, x1, y1, i, h, isTop, this);
			this.arrThreads.push(thr);
		}
	}
}
	
// function:	init
// desc:        Here is where we set the length and positions
//              of strings. It's used in two places: First
//              when initializing the thread objects, then each
//              time we resize the browser.
// ------------------------------------------------	
ThreadController.prototype.setThreadPositions = function() {

	var x, y, threadLength, thr, howMany;
	var threadCount = 0;
	// Go through all the harmonics (e.g. six across)
	for (var h = 0; h < HARMONICS; h++) {
		x = this.xLeft + h * this.boxWidth + 0.5 * this.boxWidth;
		y = this.yTop; // reset y to the top
		// There are two strings for each harmonic, except the first one.
		howMany = h == 0 ? 1 : 2;
		// Create two strings for each harmonic
		for (var i = 0; i < howMany; i++) {
			// Make the top string first
			if ((i == 1) || (h == 0)) {
				threadLength = this.boxHeight / (h+1);
			// Then make the bottom string
			} else {
				threadLength = this.boxHeight - (this.boxHeight / (h+1));
			}
			// Store the position values
			this.arrThreadPositions[threadCount][0][0] = x;
			this.arrThreadPositions[threadCount][0][1] = y;
			this.arrThreadPositions[threadCount][1][0] = x;
			this.arrThreadPositions[threadCount][1][1] = y + threadLength;
			// Prepare for the next string
			y += threadLength;
			threadCount++;
		}
	}
}

// function:	begin
// desc:
// ------------------------------------------------	
ThreadController.prototype.begin = function() {
	// initialize timer
	var d = new Date(); this.t0 = d.getTime()/1000;
	// store current mouse pos
	this.xp0 = this.getMouseX(); this.yp0 = this.getMouseY();
}

// function:	redraw
// desc:
// ------------------------------------------------	
ThreadController.prototype.redraw = function() {
	// update me
	this.upd();
}

// function:	checkInstantGrab
// desc:      check instant grab if they clicked right on top of a thread
// ------------------------------------------------	
ThreadController.prototype.checkInstantGrab = function() {

	for (var i = 0; i < this.arrThreads.length; i++) {
		th = this.arrThreads[i];
		th.checkInstantGrab();
	}
}

// function:	isGrabbing
// desc:
// ------------------------------------------------	
ThreadController.prototype.isGrabbing = function() {
	return (this.grabbed > 0);
}

// function:	getMouseX
// desc:
// ------------------------------------------------	
ThreadController.prototype.getMouseX = function() {
	// return mouseX;
}

// function:	getMouseY
// desc:
// ------------------------------------------------	
ThreadController.prototype.getMouseY = function() {
	// return mouseY;
}

// function:	upd
// desc:
// ------------------------------------------------	
ThreadController.prototype.upd = function() {
	
	// Redraw the tick marks
	this.redrawTicks();
	
	// update all threads
	for (var i = 0; i < this.arrThreads.length; i++) {
		this.arrThreads[i].upd();
	}
	// update position
	this.updPos();
	
	
	for (var i = 0; i < this.arrGrabbers.length; i++) {
		this.arrGrabbers[i].upd();
		if (this.isDebugDrawingOn) {
			this.arrGrabbers[i].redraw();
		}
	}
	// Is the mouse pressed?
	if (isMousePressing) {
		this.updPlay();
		
	} else {
		this.updNorm();
	}
	// redraw all the threads
	for (var i = 0; i < this.arrThreads.length; i++) {
		this.arrThreads[i].redraw();
	}
	
	// Redraw the grey circle nodes
	this.redrawNodes();
	
}

// function:	getSpd
// desc:		returns my current speed as ratio 0 (slowest) to fastest (1)
// ------------------------------------------------	
ThreadController.prototype.getSpd = function() {
	// return average speed
	return this.rSpd;
}

// function:	getSpdAvg
// desc:		returns my recent average speed as ratio 0 (slowest) to fastest (1)
// ------------------------------------------------	
ThreadController.prototype.getSpdAvg = function() {
	// return average speed
	return this.rSpdAvg;
}		

// function:	updPos
// desc:
// ------------------------------------------------	
ThreadController.prototype.updPos = function() {
	
	// how much time has elapsed since last update?
	var d = new Date(); this.t1 = d.getTime()/1000;
	var elap = this.t1-this.t0;
	this.t0 = this.t1;
	
	// get new position
	this.xp1 = this.getMouseX(); this.yp1 = this.getMouseY();
	// update point objects
	this.pt0.x = this.xp0; this.pt0.y = this.yp0;
	this.pt1.x = this.xp1; this.pt1.y = this.yp1;
	// 
	var dx = this.xp1-this.xp0;
	var dy = this.yp1-this.yp0;
	//
	this.dist = Math.sqrt(dx*dx + dy*dy);
	
	// current speed - pixels per second
	this.spd = this.dist/elap;
	// normalize it from 0 to 1
	this.rSpd = lim((this.spd-this.spdMin)/(this.spdMax-this.spdMin), 0, 1);
	// get average
	this.rSpdAvg = (this.rSpdAvg*(this.fAvg-1)/this.fAvg) + (this.rSpd*(1/this.fAvg));
	// store previous position
	this.xp0 = this.xp1; this.yp0 = this.yp1;
}

// function:	updNorm
// desc:
// ------------------------------------------------	
ThreadController.prototype.updNorm = function() {
	// store current mouse pos and don't do anything else
	this.xp0 = this.getMouseX(); this.yp0 = this.getMouseY();
}

// function:	upd
// desc:
// ------------------------------------------------	
ThreadController.prototype.updPlay = function() {
	//
	var xi; var yi; var th;
	// go through threads
	for (var i = 0; i < this.arrThreads.length; i++) {
		th = this.arrThreads[i];
		// find line intersection
		var pt = lineIntersect(this.pt0, this.pt1, th.pt0, th.pt1);
		// did we get a point?
		if (pt != null) {
			xi = pt.x; yi = pt.y;
			// draw test mark:
			if (this.isDemoMode == 1) this.drawMark(xi, yi);
			// if it's not already grabbed, grab it
			if (!th.isGrabbed) {
				// 
				// is the user moving too fast to allow grabbing of this string?
				if(this.getSpdAvg() <= this.rSpdGrab) {
					// grab new thread - by user
					this.grabThread(th, xi, yi, true, null);
				} else {
					// brush over thread - by user
					this.pluckThread(th, xi, yi, true, null);
				}
			}
		}
	}
}

// grabThread
// ------------------------------------------------	
ThreadController.prototype.grabThread = function(th,xp,yp,byUser,fish) {
	this.grabbed++;
	th.grab(xp, yp, byUser, fish);
}

// pluckThread
// ------------------------------------------------	
ThreadController.prototype.pluckThread = function(th,xp,yp,byUser,fish) {
	th.pluck(xp, yp, byUser, fish);
}

// function:	dropThread
// desc:
// ------------------------------------------------	
ThreadController.prototype.dropThread = function(th) {
	this.grabbed--;
	th.drop();
}

// function:	dropAll
// desc:
// ------------------------------------------------	
ThreadController.prototype.dropAll = function() {
	for (var i = 0; i < this.arrThreads.length; i++) {
		if (this.arrThreads[i].isGrabbed) {
			this.arrThreads[i].drop();
		}
	}
}

/**
 * ------------------------------------------------	
 * Update the size.
 * ------------------------------------------------	
 */
ThreadController.prototype.updateSizeAndPosition = function() {
	// 
	var drawAreaWidth = (width - leftMargin - rightMargin);
	var drawAreaHeight = (height - topMargin - bottomMargin);
	// What's the aspect ratio? Width / height, e.g. 2:1 = 2.0.
	var aspectRatio = drawAreaWidth / drawAreaHeight;
	// Don't let it get too wide
	var aspectRatioMax = TOP_ASPECT_RATIO_MAX;
	var aspectRatioMin = TOP_ASPECT_RATIO_MIN;
	if (aspectRatio > aspectRatioMax) {
		drawAreaWidth = drawAreaHeight * aspectRatioMax;
	} else if (aspectRatio < aspectRatioMin) {
		drawAreaHeight = drawAreaWidth / aspectRatioMin;
	}
	// where is the upper left corner of this
	this.xLeft = (width - drawAreaWidth) / 2;
	this.yTop = topMargin;
	// set length of the harmonic to the window height
    this.boxHeight = drawAreaHeight;
	this.boxWidth = (drawAreaWidth / HARMONICS);
	// Set my position
	this.xp = this.xLeft;
	this.yp = this.yTop;
	// Update the thread positions array
	this.setThreadPositions();
	// Now update the thread objects themselves
	for (var i = 0; i < this.arrThreads.length; i++) {
		thr = this.arrThreads[i].setPosition(
			this.arrThreadPositions[i][0][0],
			this.arrThreadPositions[i][0][1],
			this.arrThreadPositions[i][1][0],
			this.arrThreadPositions[i][1][1]
		);
	}
}

// function:	redrawTicks
// desc:        Redraw the tick marks
// ------------------------------------------------	
ThreadController.prototype.redrawTicks = function() {
	// Draw tick marks
	var howManyTicks, x, y;	
	for (var h = 0; h < HARMONICS; h++) {
		if (h < 2) {
			howManyTicks = 0; // Don't need to draw any for the first two
		} else {
			howManyTicks = h - 1;
			x = this.xLeft + h * this.boxWidth + 0.5 * this.boxWidth;			
			y = this.yTop + (this.boxHeight / (h+1));
		}
		// Draw all the ticks
		for (var t = 0; t < howManyTicks; t++) {
			this.drawTickAt(x, y);
			y += this.boxHeight / (h+1);
		}
	}
}

// function:	redrawNodes
// desc:        Draw a circle node at each node point
// ------------------------------------------------	
ThreadController.prototype.redrawNodes = function() {
	// Draw a circle at the top of each string
	for (var i = 0; i < this.arrThreads.length; i++) {
		th = this.arrThreads[i];
		this.drawNodeAt(th.xp0, th.yp0);
		// Draw the bottom circle if it's the bottom string
		// (or if it's the first harmonic, who only has one string)
		if ((!th.isTop) || (i == 0)) {
			this.drawNodeAt(th.xp1, th.yp1);
		}
	}
}

// function:	drawNodeAt
// desc:        Draw a circle node centered at x, y
// ------------------------------------------------	
ThreadController.prototype.drawNodeAt = function(x, y) {
	this.cv.beginPath();
	this.cv.fillStyle = getColor(this.nodeColor);
	this.cv.arc(x, y, this.nodeRadius, 0, Math.PI*2, false);
	this.cv.fill();
	this.cv.closePath();	
}


// function:	drawTickAt
// desc:        Draw a small tick mark centered at ax, y
// ------------------------------------------------	
ThreadController.prototype.drawTickAt = function(x, y) {	
	this.cv.beginPath();
	this.cv.lineCap = "round";
	this.cv.strokeStyle = getColor(this.tickColor);
	this.cv.lineWidth = this.tickStrokeSize;
  	this.cv.moveTo(x - this.tickSize/2, y);
  	this.cv.lineTo(x + this.tickSize/2, y);
	this.cv.stroke();
	this.cv.closePath();	
}

// function:	createGrabber
// desc:        Create a new grabber object
// ------------------------------------------------	
ThreadController.prototype.createGrabber = function(isMousePm, touchIdPm) {
	var g = new ThreadGrabber(this, isMousePm, touchIdPm);
	// add me to the River array
	this.arrGrabbers.push(g);
	return g;
}

// function:	destroyGrabber
// desc:        Create a new grabber object
// ------------------------------------------------	
ThreadController.prototype.destroyGrabber = function(grabberPm) {
	var g;
	for (var i = 0; i < this.arrGrabbers.length; i++) {
		g = this.arrGrabbers[i];
		if (g == grabberPm) {
			this.arrGrabbers.splice(i, 1);
			delete(g);
		}
	}
}

// function:	getMouseX
// desc:
// ------------------------------------------------	
ThreadController.prototype.getMouseX = function() {
	return xMouse;
}

// function:	getMouseY
// desc:
// ------------------------------------------------	
ThreadController.prototype.getMouseY = function() {
	return yMouse;
}

// function:	mouseDown
// ------------------------------------------------	
ThreadController.prototype.mouseDown = function() {
	// Create grabber object - linked to mouse
	var g = this.createGrabber(true, -1);
	this.grabberMouse = g;
	
	this.isMouseDown = true;
	// check instant grab - in case they pressed right on top of a thread
	this.checkInstantGrab();	
	// stop updating
	// if we currently have one
	if (this.isGrabbing()) {
		// this.dropAll();
	}
}

// function:	mouseUp
// ------------------------------------------------	
ThreadController.prototype.mouseUp = function() {
	// Destroy grabber object
	this.destroyGrabber(this.grabberMouse);
		
	// stop updating
	this.isMouseDown = false;
	// if we currently have one
	if (this.isGrabbing()) {
		this.dropAll();
	}
}

