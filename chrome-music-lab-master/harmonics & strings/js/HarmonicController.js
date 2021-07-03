// class:	HarmonicController
// desc:
// ------------------------------------------------	
var HarmonicController = function() {

	// ----------------
	// variables
	// ----------------
	// my main canvas object
	this.cv;
	// Array to store Harmonics.
	this.arrHarmonics = new Array();
	// Frequency of the bass lowest note (starting on F)
	this.startingFrequency = 174.61;
	// initialize
	this.init();
	
}

// function:	mouseDown
// ------------------------------------------------	
HarmonicController.prototype.init = function() {
	// canvas
	this.cv = ctx;
	
	// create Harmonics
	for (var i = 0; i < HARMONICS; i++) {
		this.arrHarmonics[i] = new Harmonic(i, this);
	}	
}
/**
 * ------------------------------------------------	
 * Begin
 * ------------------------------------------------	
 */
HarmonicController.prototype.begin = function() {
}

// function:	upd
// desc:
// ------------------------------------------------	
HarmonicController.prototype.upd = function() {
	
	// Update the tracks
	for (var i = 0; i < HARMONICS; i++) {
		this.arrHarmonics[i].isATouchOverMe = false;
		this.arrHarmonics[i].upd();		
	}	
	
	// Is the mouse pressed?
	if (isMousePressing) {
		// Check if that touch event is intersecting a harmonic
		for (var j = 0; j < HARMONICS; j++) {
			this.arrHarmonics[j].checkIfATouchIsOverMe(xMouse, yMouse);
		}		
		
	// Else check for touches
	} else {
	
		var currentTouch;
		// Go through the touch events
		for (var i=0; i < currentTouches.length; i++) {
			currentTouch = currentTouches[i];
			// Check if that touch event is intersecting a harmonic
			for (var j = 0; j < HARMONICS; j++) {
				this.arrHarmonics[j].checkIfATouchIsOverMe(currentTouch.pageX, currentTouch.pageY);
			}
		}
	}
	
	// Update the tracks
	for (var i = 0; i < HARMONICS; i++) {
		this.arrHarmonics[i].checkIfIShouldBePlaying();
	}		
}

/**
 * ------------------------------------------------	
 * Update the size.
 * ------------------------------------------------	
 */
HarmonicController.prototype.updateSizeAndPosition = function() {
	
	for (var i = 0; i < HARMONICS; i++) {
		var h = this.arrHarmonics[i];
		if (h) {
		  h.updateSizeAndPosition();
	  	}
	}		
	
}


// function:	mouseDown
// ------------------------------------------------	
HarmonicController.prototype.mouseDown = function() {

}

// function:	mouseUp
// ------------------------------------------------	
HarmonicController.prototype.mouseUp = function() {

}

