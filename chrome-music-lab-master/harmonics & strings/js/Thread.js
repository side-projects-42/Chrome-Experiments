// class:	Thread
// desc:
// param:   cvPm: canvas object
// ------------------------------------------------	
var Thread = function(xp0Pm, yp0Pm, xp1Pm, yp1Pm, indPm, indHarmonicPm, isTopPm, threadControllerPm) {
	this.m = threadControllerPm;
	// start and end position
	this.xp0 = xp0Pm; this.yp0 = yp0Pm;
	this.xp1 = xp1Pm; this.yp1 = yp1Pm;
	// start and end as point objects
	this.pt0;
	this.pt1;
	// my permanent midpoint
	this.xMid; this.yMid;		
	// the position of my swinging pendulum point (midpoint)
	this.xc; this.yc;
	// my grabbed point by user
	this.xg; this.yg; this.xgi; this.ygi;
	this.xg1; this.yg1;
	this.xg0; this.yg0;
	// drarwing point
	this.xd; this.yd;
	// store permanent dx, dy
	this.dx; this.dy;
	
	// ratio for curvature. Make this around 0.5 or higher
	this.rBezier = 0.45;
	// distance we can pull perpendicularly from middle pt of string (as ratio length)
	// (amplitude of wave)
	this.rDistMax = 0.09;
	// minimum distance to force string to move, when you brush it
	this.rDistMin = 0.04;
	// max amplitude of wave when oscillating (as ratio of length)
	this.rAmpMax = 0.05;
	// minimum distance to move (px), amplitude, so if you brush it it always shows movement
	this.ampPxMin = 3;
	// maximum pixel distance to move, amplitude
	this.ampPxMax = 9;
	// frequency of oscillation - this is the increment per frame for t value.
	// higher gives higher frequency
	this.freq0 = 1.4; // frequency for long strings
	this.freq1 = 2.2; // frequency for short strings
	this.freq;
	// amplitude dampening - how quickly it dampens to nothing - ratio 0 to 1
	this.ampDamp0 = 0.97;
	this.ampDamp1 = 0.98;
	this.ampDamp;
	// length where we cap it highest/lowest pitch (px)
	this.len0 = 40; this.len1 = 700;
	// temporary distance variables
	this.distMax; this.distPerp;
	// how close do we have to be to instantly grab a thread - perpendicular distance (px)
	this.distInstantPerp = 6;	
	// stores ratio from 0 to 1 where user has grabbed along the string
	this.rGrab; this.rHalf;
	// my main angle
	this.ang;
	// my perpendicular angle
	this.angPerp;
	// total length of this thread (when unstretched)
	this.len;
	
	// temporary variables
	this.dx0; this.dy0; this.dx1; this.dy1; this.dist0; this.dist1;
	this.dxBez0; this.dyBez0; this.dxBez1; this.dyBez1;
	
	// my overall index number of all threads
	this.ind = indPm;
	// my harmonic number
	this.indHarmonic = indHarmonicPm;
	// stroke width, hex
	this.strokeSize = 3 * 2;
	// color range
	// public var hex1 = 0xBBBBBB, hex0 = 0x111111;
	this.col0 = [102, 102, 102, 1.0]; // Starting color: grey
	this.col1 = [255, 183, 41, 1.0];  // Ending color: when highlighted
	this.colorRatio = 0.0;
	this.col = lerpColor(this.col0, this.col1, this.colorRatio);
		
	// frame counter
	this.ctGrab = 0;
	this.t = 0;
	// current amplitude
	this.amp; this.ampMax;
	// current stretch strength as ratio
	this.rStrength;
	
	// my pitch index (0, 1, 2...) - and as ratio
	this.pitchInd; this.rPitch;
	// lowest and highest volume range for users
	this.vol0 = 0.3; this.vol1 = 0.6;
	// lowest and highest volume range for fish
	this.vol0Fish = 0.2; this.vol1Fish = 0.55;
	// minimum pan (ratio -1 to 1)
	this.pan0 = -1; this.pan1 = 1;	
	// is update on
	this.isUpdOn = false;
	// oscillation direction
	this.oscDir;
	
	// currently grabbed
	this.isGrabbed = false;
	// currently oscillating
	this.isOsc = false;
	// was just dropped
	this.isFirstOsc = false;

	// link to main
	this.m;
	// audio element
	this.au;
	// audio object
	this.auObj;
	// audio channel
	
	// If a "fish" is grabbing me.
	// In this world, a "fish" is really the users' fingers/touch events
	this.fishGrab = null;	
	
	// Am I a string that's on the top or the bottom of this harmonic?
	this.isTop = isTopPm;

	// Set position to the starting values
	this.setPosition(this.xp0, this.yp0, this.xp1, this.yp1);
	this.init();
}

// function:	init
// desc:
// ------------------------------------------------	
Thread.prototype.init = function() {
	
	// canvas
	this.cv = ctx;
}

// function:	redraw
// desc:
// ------------------------------------------------	
Thread.prototype.redraw = function() {
	
	// grabbed mode (or on the first osc after being dropped)
	if (this.isGrabbed || this.isFirstOsc) {
		this.xd = this.xg; this.yd = this.yg;
	// oscillating freely mode
	} else {
		this.xd = this.xc; this.yd = this.yc;
	}
		
	this.cv.beginPath();
	this.cv.lineCap = "round";
	this.cv.strokeStyle = getColor(this.col);
	this.cv.lineWidth = this.strokeSize;
	
	// ---------------
	this.dx0 = this.xd-this.xp0; this.dy0 = this.yd-this.yp0;
	this.dx1 = this.xp1-this.xd; this.dy1 = this.yp1-this.yd;
	// distance
	this.dist0 = Math.sqrt(this.dx0*this.dx0 + this.dy0*this.dy0);
	this.dist1 = Math.sqrt(this.dx1*this.dx1 + this.dy1*this.dy1);
	
  	// move to center point
  	this.cv.moveTo(this.xd, this.yd);
  	// move to the center pendulum point
  	this.dxBez0 = this.rBezier*this.dist0*Math.cos(this.ang)
  	this.dyBez0 = this.rBezier*this.dist0*Math.sin(this.ang)			
  	// move to the center pendulum point
  	this.dxBez1 = this.rBezier*this.dist1*Math.cos(this.ang)
  	this.dyBez1 = this.rBezier*this.dist1*Math.sin(this.ang)			
  	//
  	this.cv.quadraticCurveTo(this.xd-this.dxBez0, this.yd-this.dyBez0, this.xp0, this.yp0);
  	// move to first node
  	this.cv.moveTo(this.xd, this.yd);
  	// 
  	this.cv.quadraticCurveTo(this.xd+this.dxBez1, this.yd+this.dyBez1, this.xp1, this.yp1);
	
	// close path
	this.cv.stroke();
	this.cv.closePath();
}

// function:	upd
// desc:		
// ------------------------------------------------	
Thread.prototype.upd = function() {
	// is thread currently grabbed
	if (this.isGrabbed) {
		this.updGrab();
	// is thread currently oscillating
	} else if (this.isOsc) {
		this.updOsc();
	}
}

// function:	updOsc
// desc:		Update mode while oscillating
// ------------------------------------------------	
Thread.prototype.updOsc = function() {
	
	// ease it back to the zero line first
	if (this.isFirstOsc) {
		var ease = 0.8;
		var dxg = this.xg1 - this.xg;
		var dyg = this.yg1 - this.yg;
		//
		this.xg += dxg*ease;
		this.yg += dyg*ease;
		// have we arrived?
		if ((Math.abs(dxg) < 2) && (Math.abs(dyg) < 2)) {
			// initialize
			this.t = 0; this.oscDir = 1;
			this.isFirstOsc = false;
			// which direction it has been going in
			var sx0 = sign(dxg);
			var sx1 = sign(Math.sin(this.ang));
			// reverse the initial oscillation direction if needed
			if (sx0 != sx1) { this.oscDir *= -1; }
		}
	}
	else {
		// increment counter
		this.t += this.freq*this.oscDir;
		//t += 0.5*oscDir;
		// make c oscillate between 0 and 1 with sin 
		var c = Math.sin(this.t);
		// dampen the amplitude
		this.amp *= this.ampDamp;
		//
		this.xc = this.xMid + c*Math.sin(this.ang)*this.amp;
		this.yc = this.yMid - c*Math.cos(this.ang)*this.amp;
		// if amplitude is below mimum, cut it
		if (this.amp < 0.5) {
			this.amp = 0; 
			//switchUpd("off");
			this.isOsc = false;
		}
	}
	
	// Set color based on amplitude
	this.colorRatio = Math.pow((this.amp / this.ampMax), 0.3); // raising it to a power helps it ease out differently
	this.col = lerpColor(this.col0, this.col1, this.colorRatio);
	
}

// function:	updGrab
// desc:		Update mode while grabbed
// ------------------------------------------------	
Thread.prototype.updGrab = function() {
	
	// is this thread being held by a fish?
	if (this.fishGrab != null) {
		var xu = this.fishGrab.xp1; var yu = this.fishGrab.yp1;
	// else grabbed by user
	} else {
		var xu = this.m.getMouseX(); var yu = this.m.getMouseY(); 
	}	
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;
	// angle
	var ang0 = Math.atan2(dyu,dxu); var ang1 = this.ang-ang0;
	// direct distance 
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// perpendicular distance
	this.distPerp = hyp*Math.sin(ang1);
	// distance parallel along the line
	var distPara = hyp*Math.cos(ang1);
	// how far as a ratio from 0 to 1 are we on the line
	this.rGrab = lim(distPara/this.len, 0, 1);
	// normalize it to increase to 1 at the halfway point
	if (this.rGrab <= 0.5) { this.rHalf = this.rGrab/0.5; } else { this.rHalf = 1-(this.rGrab-0.5)/0.5; }
	// what distance can we pull the string at this point?
	var distMaxAllow = this.distMax*this.rHalf;
	// set the current stretch strength
	this.rStrength = lim(Math.abs(this.distPerp)/this.distMax, 0, 1);

	// has the user's point pulled too far?
	if (Math.abs(this.distPerp) > distMaxAllow) {
		this.m.dropThread(this);
	} else {
		// that grabbed point is ok, allow it
		this.xg = xu; this.yg = yu;
	}
	//
	this.ctGrab++;
	//this.redraw();	
}

// function:	stopNote
// desc:		Update mode while sound is on
// ------------------------------------------------	
Thread.prototype.stopNote = function() {
	this.auObj.pause();
}

// function:	pluck
// desc:		brush over this string in one frame
// ------------------------------------------------	
Thread.prototype.pluck = function(xp, yp, byUser, fish) {
  
	// store as initial position
	this.xgi = this.xg = xp; this.ygi = this.yg = yp;
	// if it was triggered by a train
	if (byUser) {
		// user's current mouse position
		var xu = this.m.getMouseX(); var yu = this.m.getMouseY();
		var spd = this.m.getSpdAvg()
	} else {
		var xu = fish.getX(); var yu = fish.getY();
		var spd = 0.1; // just make speed a reasonable value
	}	
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;			
	// use our current xg and yg, that's where the user intersected the string
	var dxg = this.xgi-this.xp0; var dyg = this.ygi-this.yp0;
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// as ratio 0 to 1
	this.rGrab = lim(hyp/this.len, 0, 1);
	// normalize it to increase to 1 at the halfway point
	if (this.rGrab <= 0.5) { this.rHalf = this.rGrab/0.5; } else { this.rHalf = 1-(this.rGrab-0.5)/0.5; }					
	var distMaxAllow = this.distMax*this.rHalf;
	// how far do we want it to pull? Base on user's speed
	// this.distPerp = (1-this.m.getSpdAvg())*distMaxAllow;
	// We changed this to simply have it pull the maximum amount
	// because it was hard to see on the short high strings
	this.distPerp = distMaxAllow;
	// set new strength
	this.rStrength = lim(Math.abs(this.distPerp)/this.distMax, 0, 1);
	// less than minimum? (always vibrate string a little bit)
	if (this.distPerp < this.ampPxMin) this.distPerp = this.ampPxMin;
	// set it
	this.xg = this.xgi + this.distPerp*Math.cos(this.angPerp);
	this.yg = this.ygi + this.distPerp*Math.sin(this.angPerp);
	
	// ------------------
	// reset me to the center point
	this.xc = this.xMid; this.yc = this.yMid;
	// already oscillating?
	if (this.isOsc) {
		// already oscillating - boost the oscillation strength just a bit
		this.rStrength = lim((this.rStrength*0.5) + (this.amp/this.ampMax), 0, 1);
		// set new amplitude
		this.amp = this.rStrength*this.ampMax;				
	// not oscillating - start oscillating now
	} else {
		// store current amplitude based on strength
		this.amp = this.rStrength*this.ampMax;
		// start oscillating
		this.startOsc();
	}
	// calculate volume
	if (byUser) {
		vol = lerp(this.vol0, this.vol1, this.rStrength);
	// it's a car
	} else {
		vol = lerp(this.vol0Fish, this.vol1Fish, this.rStrength);			
	}
	// set pan based on x position
	var pan = lerp(this.pan0, this.pan1, lim(xu/this.m.width, 0, 1));
	// play note
	this.playNote(vol, pan);
}

// function:	grab
// desc:		grab this string and hold it
// ------------------------------------------------	
Thread.prototype.grab = function(xp, yp, byUser, car) {
  // let user steal it from a fish
	if (byUser) {
		this.fishGrab = null;
	} else {
		// store car that is grabbing me, and link me to the car
		this.fishGrab = car; this.fishGrab.thrGrab = this;
	}
	// store as initial position
	this.xgi = this.xg = xp; this.ygi = this.yg = yp;
	// start counter			
	this.ctGrab = 0;
	this.isGrabbed = true;
	// update once now
	this.updGrab();	
}

// function:	drop
// desc:
// ------------------------------------------------	
Thread.prototype.drop = function() {
  
	//
	this.isGrabbed = false;
	// reset me
	this.xc = this.xMid; this.yc = this.yMid;
	// store current amplitude based on strength
	this.amp = this.rStrength*this.ampMax;
	// play note - is it by a car?
	if (this.fishGrab != null) {
		var vol = lerp(this.vol0Fish, this.vol1Fish, this.rStrength);
		this.fishGrab.thrGrab = null;
		this.fishGRab = null;
	// else use normal user volume limits
	} else {
		var vol = lerp(this.vol0, this.vol1, this.rStrength);
	}
	// set pan based on x position
	var posRat = lim(this.xg/this.m.width, 0, 1);
	// set panning ratio -1 to 1
	var pan = lerp(this.pan0, this.pan1, posRat);
	//
	this.playNote(vol, pan);
	// start oscillation
	this.startOsc();
}

// function:	startOsc
// desc:
// ------------------------------------------------	
Thread.prototype.startOsc = function() {
	// where does the grabbed point want to return to
	this.xg1 = this.xp0 + this.rGrab*this.dx;
	this.yg1 = this.yp0 + this.rGrab*this.dy;			
	// store start position
	this.xg0 = this.xg; this.yg0 = this.yg;			
	// counter
	t = 0;
	// we are on our first cycle of oscillation
	this.isFirstOsc = this.isOsc = true;			
}

// playNote
// ------------------------------------------------	
Thread.prototype.playNote = function(vol, pan) {
	var p;
	if (this.isTop) {
		p = this.m.arrPlayers[this.indHarmonic][0];
	} else {
		p = this.m.arrPlayers[this.indHarmonic][1];
	}
	p.start();
	// normalize pan to -1 to 1
	//smPlayNote(this.pitchInd, vol, pan);
}

// function:	setStretch
// desc:
// ------------------------------------------------	
Thread.prototype.setStretch = function(r) {
	var hyp = this.r*this.distMax;
	this.xc = this.xMid + this.hyp*Math.cos(this.angPerp);
	this.yc = this.yMid + this.hyp*Math.sin(this.angPerp);
}

// function:	checkInstantGrab
// desc:      Check when user first clicks if they clicked right on top of a thread,
//            intending to make it play.
// ------------------------------------------------	
Thread.prototype.checkInstantGrab = function() {
	// make sure it's not already grabbed
	if (this.isGrabbed) return;
	// get current mouse position
	var xu = this.m.getMouseX(); var yu = this.m.getMouseY(); 
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;
	// angle
	var ang0 = Math.atan2(dyu,dxu); var ang1 = this.ang-ang0;
	// direct distance 
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// perpendicular distance
	this.distPerp = hyp*Math.sin(ang1);
	// distance parallel along the line
	var distPara = hyp*Math.cos(ang1);
	// how far as a ratio from 0 to 1 are we on the line
	this.rGrab = distPara/this.len;
	// are we close enough to warrant an instant grab?
	if ((Math.abs(this.distPerp) < this.distInstantPerp) && (this.rGrab > 0) && (this.rGrab < 1)) {
		this.m.grabThread(this, xu, yu, true, null);
	}
}

// function:	setPosition
// desc:      Check when user first clicks if they clicked right on top of a thread,
//            intending to make it play.
// ------------------------------------------------	
Thread.prototype.setPosition = function(x0, y0, x1, y1) {
	// start and end position
	this.xp0 = x0; this.yp0 = y0;
	this.xp1 = x1; this.yp1 = y1;
	// start and end as point objects
	this.pt0;
	this.pt1;
	// my permanent midpoint
	this.xMid; this.yMid;			
	
	// point object
	this.pt0 = new Point(this.xp0, this.yp0);
	this.pt1 = new Point(this.xp1, this.yp1);
	//
	this.dx = this.xp1-this.xp0;
	this.dy = this.yp1-this.yp0;
	// store midpoint
	this.xMid = this.xp0 + this.dx*0.5;
	this.yMid = this.yp0 + this.dy*0.5;
	// store angle
	this.ang = Math.atan2(this.dy, this.dx);
	//
	this.angPerp = Math.PI/2 - this.ang;
	// store length
	this.len = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
	// set my pitch
	if (this.len > this.len1) { this.rPitch = 0; }
	else if (this.len < this.len0) { this.rPitch = 1; }
	else { this.rPitch = 1-norm(this.len, this.len0, this.len1); }
	// initially set pendulum to midpoint
	this.xc = this.xMid; this.yc = this.yMid;
	// store max distance we can pull from middle of string perpendicularly
	this.distMax = this.rDistMax*this.len;
	// Always make it move at least a little bit.
	if (this.distMax > this.ampPxMax) {
		this.distMax = this.ampPxMax;
	} else if (this.distMax < this.ampPxMin) {
		this.distMax = this.ampPxMin;
	}	
	// set my oscillation frequency
	this.freq = lerp(this.freq0, this.freq1, this.rPitch);
	this.ampDamp = lerp(this.ampDamp0, this.ampDamp1, this.rPitch);
	// set my starting amplitude
	this.ampMax = this.rAmpMax*this.len;
	if (this.ampMax > this.ampPxMax) {
		this.ampMax = this.ampPxMax;
	} else if (this.ampMax < this.ampPxMin) {
		this.ampMax = this.ampPxMin;
	}
}
