/**
 * ------------------------------------------------	
 * Harmonic class.
 * ------------------------------------------------	
 */
var Harmonic = function(indPm, controllerPm) {
	// my index number
	this.ind = indPm;
	this.m = controllerPm;
	// my harmonic series number
	this.series = this.ind + 1;
	// how many periods will I draw
	this.periods = (this.series / 2);
	// Stroke size.
	this.ratioStroke = 0.0;
	this.strokeMin = 2.5 * 2; this.strokeMax = 3.8 * 2;
	// width and height of the bounding box drawing area of each harmonic
	this.boxWidth; this.boxHeight;
	// my position
	this.xp; this.yp;
	// Amplitude range.
	this.amplitudeMin; this.amplitudeMax;
	// Current amplitude is stored as a ratio from 0 to 1 between min and max
	this.amplitudeRatio = 0;
	// Period size - length of a full sine wave cycle
	this.halfPeriodLength;
	// color range - r, g, b, a - stored as both current color and ratio 0 to 1
	var arrColorRange = [
		[102, 102, 102, 1.0], // Starting color: grey
		[255, 183, 41, 1.0]  // Ending color: when highlighted
	];
	this.colorMin = arrColorRange[0];
	this.colorMax = arrColorRange[1];
	this.colorCurr = this.colorMin;	
	// Current color is stored as a ratio in that range
	this.colorRatio = 0;
	// counter
	this.oscCt = 0 -this.ind * 0.6;
	// Am I currently playing?
	this.isPlaying = false;
	// My volume range
	this.volumeMax = 0; this.volumeMin = -15;
	this.volumeRatio = 1;
	// Easing ratio (0 to 1)
	this.easingRelease = 0.04;
	this.easingAttack = 0.2;
	this.easing = this.easingAttack;
	// My overall ratio of pressed amount from 0 to 1
	this.ratioTarget = 0.0;
	this.ratioCurr = 0.0;
	// store whether a touch event is currently touching me
	this.isATouchOverMe = false;	
	//
	this.init();
}

/**
 * ------------------------------------------------	
 * Initialize.
 * ------------------------------------------------	
 */
Harmonic.prototype.init = function() {
    // set the canvas I draw to
    this.cv = ctx;
	// create synth object
	this.synth = new Tone.SimpleSynth().toMaster();
	this.synth.oscillator.type = "sine";
	this.synth.envelope.attack = 0.9;
	this.synth.envelope.decay = 1.5;
	this.synth.envelope.sustain = 0.4;
	this.synth.envelope.release = 1.8;
	this.setVolume(0.5);

}

/**
 * ------------------------------------------------	
 * Set volume.
 * ------------------------------------------------	
 */
Harmonic.prototype.setVolume = function(r) {
	this.volumeRatio = r;
	// this.synth.volume.value = lerp(this.volumeMin, this.volumeMax, this.volumeRatio);
	this.synth.volume.value = -6;	
}

/**
 * ------------------------------------------------	
 * Update function.
 * ------------------------------------------------	
 */
Harmonic.prototype.upd = function() {
	
	
	this.ratioCurr += (this.ratioTarget - this.ratioCurr) * this.easing;
	this.amplitudeRatio = this.colorRatio = this.strokeRatio = this.ratioCurr;	
	
	// Make it quiver - how fast?
	this.oscCt += 0.9;
	// Sin goes from -1 to 1. Normalize to a 0 to 1 range
	var ct = (1 + Math.sin(this.oscCt)) / 2;
	// make it quiver
	if (this.isPlaying) {
		this.amplitudeRatio += ct * 0.15;
	}
	

	// set current color
	this.colorCurr = lerpColor(this.colorMin, this.colorMax, this.colorRatio);

	// top center point
	var xCenter = this.xp + this.boxWidth/2;
	// initialize y position
	var xNext, yNext;
	// Store previous positions xPrev, yPrev;
	var xPrev, yPrev;
	// Control points for curves
	var xControl0, xControl1, yControl0, yControl1;
	// go between - zero crossing, positive crest, zero crossing, negative crest, etc.
	var step = 0;
	var flipSign = 1;
	// curviness - you can't get an exact sine curve, this controls where the bezier control
	// points go. From 0 (like a circle) to 1 (like a triangle)
	var curviness = 0.3;
	//var curviness = 1.5;
	// current pixel amplitude
	var amplitudeCurr = lerp(this.amplitudeMin, this.amplitudeMax, this.amplitudeRatio);
	var strokeCurr = lerp(this.strokeMin, this.strokeMax, this.strokeRatio);
	// draw two curves - one goes left, one goes right.
	for (var j = 0; j <= 1; j++) {
		
		//
		xNext = xPrev = xCenter;
		yNext = yPrev = this.yp;

		// move to starting point
		this.cv.beginPath();
		this.cv.moveTo(xCenter, this.yp);
		
		var period = this.periodLength;
		var interval = this.halfPeriodLength;
		var S, C1, C2, E;
		
		var drawMarkers = false;
		var markerRadius = 5;
		
		// how many times to loop through
		for (var i = 0; i < (this.periods * 2); i += 2) {
			
	        // first segment
	        S = {x:xCenter, y:this.yp + i*interval};
	        C1 = {x:xCenter + flipSign * amplitudeCurr, y:this.yp + i*interval + this.periodLength/2 * curviness};
	        C2 = {x:xCenter + flipSign * amplitudeCurr, y:this.yp + (i+1)*interval - this.periodLength/2 * curviness};
			
	        E = {x:xCenter, y:this.yp+(i+1)*interval};
	        this.cv.moveTo(S.x, S.y);
	        this.cv.bezierCurveTo(C1.x, C1.y, C2.x, C2.y, E.x, E.y);
			
			// Don't draw the second segment for some of them.
			if ((this.ind % 2 == 0) && (i == this.periods*2 - 1)) {
				break;
			}
	        // second segment
	        C1 = {x:xCenter - flipSign * amplitudeCurr, y:this.yp + (i+1)*interval + this.periodLength/2 * curviness};
	        C2 = {x:xCenter - flipSign * amplitudeCurr, y:this.yp + (i+2)*interval - this.periodLength/2 * curviness};
	        E = {x:xCenter, y:this.yp + (i+2)*interval};
			
	        this.cv.bezierCurveTo(C1.x, C1.y, C2.x, C2.y, E.x, E.y);
			
		}
		// Set color and stroke size
		this.cv.strokeStyle = getColor(this.colorCurr);
		this.cv.lineWidth = strokeCurr;
		this.cv.lineCap = "round";
		// Draw it and close the path.
		this.cv.stroke();
		this.cv.closePath();
		
		// flip the sign for the other direction.
		flipSign *= -1;
	}
}

/**
 * ------------------------------------------------	
 * Update the size.
 * ------------------------------------------------	
 */
Harmonic.prototype.updateSizeAndPosition = function() {
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
	var xLeft = (width - drawAreaWidth) / 2;
	var yTop = topMargin;
	// set length of the harmonic to the window height
    this.boxHeight = drawAreaHeight;
	this.boxWidth = (drawAreaWidth / HARMONICS);
	// Size of the half-period - how many px for a single crest to go up and down
	this.periodLength = (this.boxHeight / this.series) * 2;
	this.halfPeriodLength = (this.boxHeight / this.series);
	// set max amplitude size. Just make it almost fill up the box.
	this.amplitudeMax = (this.boxHeight * 0.1) / 2;
	// Set the minimum amplitude to a little bit smaller than the max.
	this.amplitudeMin = this.amplitudeMax * 0.6;
	// Set my position
	this.xp = xLeft + this.boxWidth * this.ind;
	this.yp = yTop;
}

/**
 * ------------------------------------------------	
 * Check if given x,y value intersects with this one
 * ------------------------------------------------	
 */
Harmonic.prototype.checkIfATouchIsOverMe = function(x,y) {
	if (Math.abs((this.xp + this.boxWidth/2) - x) < (this.boxWidth * 0.5)) {
		this.isATouchOverMe = true;
	}
	// else just leave it be
}

/**
 * ------------------------------------------------	
 * Check if given x,y value intersects with this one
 * ------------------------------------------------	
 */
Harmonic.prototype.checkIfIShouldBePlaying = function() {
	if (this.isATouchOverMe) {
		if (!this.isPlaying) {
			this.startPlaying();
		}
	} else {
		if (this.isPlaying) {
			this.stopPlaying();
		}
	}
}

/**
 * ------------------------------------------------	
 * Start playing
 * ------------------------------------------------	
 */
Harmonic.prototype.startPlaying = function() {
	this.isPlaying = true;
	this.synth.triggerAttack(this.m.startingFrequency * (this.ind+1));	
	this.easing = this.easingAttack;
	this.ratioTarget = 1.0;
}

/**
 * ------------------------------------------------	
 * Stop playing
 * ------------------------------------------------	
 */
Harmonic.prototype.stopPlaying = function() {
	this.isPlaying = false;
	this.synth.triggerRelease();
	this.easing = this.easingRelease;	
	this.ratioTarget = 0.0;
}

