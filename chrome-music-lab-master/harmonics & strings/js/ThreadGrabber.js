// class:	ThreadGrabber
// desc:
// ******
// I'm adapting the Fish object to be treated basically like an invisible mouse cursor
// we should remove all of the drawing functions, this will become invisible
// no river, traveling, etc
// So ideally the mouse events and touch events can simply be treated like little ThreadGrabber object
// ------------------------------------------------	
var ThreadGrabber = function(threadControllerPm, isMousePm, touchIdPm) {
	
	// reference to main object
	this.m = threadControllerPm;
	// Am I linked to the mouse object? If not, I'm a touch.
	this.isMouse = isMousePm;
	// Touch object's index that I'm linked to
	this.touchId = touchIdPm;
	// Threads that I've grabbed
	this.arrGrabbed = new Array();
	// my color (RGBA)
	this.col = [20, 100, 190, 1];
	// canvas and object
	this.cv; this.cvo;
	// radius size (px) if I'm drawn
	this.rad = 5;
	// set position. initialize to the start point
	this.xp0; this.xp1;
	this.yp0; this.yp1;
	// maintain position as point objects too, for the intersection algorithm
	this.pt0 = new Point();
	this.pt1 = new Point();	
	// store change in position
	this.dx, this.dy;
	// first time running
	this.isFirstRun = true;	
	// below what speed (px/frame) can a fish grab a thread - stored as
	// squared value so we don't have to do sqrt over and over - so e.g. 25 means 5px / frame
	this.spdSquaredGrab = 25;
	// the thread I'm grabbing
	this.thrGrab = null;
	// initialize
	this.init();
}

// function:	init
// desc:      Initialize me
// ------------------------------------------------	
ThreadGrabber.prototype.init = function() {
  
	// link to canvas object
	this.cv = ctx;
}

// function:	setPos
// desc:      Set my position
// ------------------------------------------------	
ThreadGrabber.prototype.setPos = function(x, y) {
  // store previous position
  this.xp0 = this.xp1; this.yp0 = this.yp1;  
  // store new position
  this.xp1 = x; this.yp1 = y;
  // store change in position
  this.dx = this.xp1-this.xp0;
  this.dy = this.yp1-this.yp0;
}

// function:	redraw
// desc:      Redraw me
// ------------------------------------------------	
ThreadGrabber.prototype.redraw = function() {
	this.cv.beginPath();
	this.cv.fillStyle = getColor(this.col);
	this.cv.arc(this.xp1, this.yp1, this.rad, 0, Math.PI*2, false);
	this.cv.fill();
}


// function:	upd
// desc:      Update function
// ------------------------------------------------	
ThreadGrabber.prototype.upd = function() {

		
	// If I'm the mouse object, listen to mouse position
	if (this.isMouse) {
		this.setPos(xMouse, yMouse);
	} else {
		// else need to listen to touch object
		var touchIndex = findCurrentTouchIndex(this.touchId);
		var t = currentTouches[touchIndex];
		this.setPos(t.pageX, t.pageY);
	}

	// update point objects
	this.pt0.x = this.xp0; this.pt0.y = this.yp0;
	this.pt1.x = this.xp1; this.pt1.y = this.yp1;
	// update my speed - store as a squared value instead of actual speed
	// so we don't have to run a sqrt function every frame for every fish
	this.spdSquared = this.dx*this.dx + this.dy*this.dy;
	// if this is the first time running it, exit now - don't check threads
	if (this.isFirstRun) { this.isFirstRun = false; return; }
	
	// Loop through all threads and see if we grabbed any.
	for (var i = 0; i < this.m.arrThreads.length; i++) {
		th = this.m.arrThreads[i];		
		// find line intersection
		var pt = lineIntersect(this.pt0, this.pt1, th.pt0, th.pt1);
		// did we get a point?
		if (pt == null) continue;
		//
		xi = pt.x; yi = pt.y;
		// only try to pluck or grab if it's not already grabbed by a different fish
		// * - thought do we want to make them "stealable"?
		if ((!th.isGrabbed) && (!isNaN(xi)) && (!isNaN(yi))) {
			// am I am going too fast, brush over it
			if (this.spdSquared > this.spdSquaredGrab) {
				this.m.pluckThread(th, xi, yi, false, this);
			// else non-express, can grab
			} else {
				this.m.grabThread(th, xi, yi, false, this);
				this.arrGrabbed.push(th);
			}
		}
	}
	
}

// function:	destroy
// desc:      Destroy me
// ------------------------------------------------	
ThreadGrabber.prototype.destroy = function() {
	// remove me from the array
	this.m.destroyGrabber(this);
}

// function:	dropAll
// desc:
// ------------------------------------------------	
ThreadGrabber.prototype.dropAll = function() {
	for (var i = 0; i < this.arrGrabbed.length; i++) {
		this.arrGrabbed[i].drop();
	}
}

// function:	getX
// desc:      return x position
// ------------------------------------------------	
ThreadGrabber.prototype.getX = function() {
	return this.xp1;
}

// function:	getY
// desc:      return y position
// ------------------------------------------------	
ThreadGrabber.prototype.getY = function() {
	return this.yp1;
}
