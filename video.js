
function video() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
video.prototype = proto;

/*video.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
	 this.add.text(this.world.centerX-123, this.world.centerY-257, "Loading videos ...", { font: "45px Arial", fill: "#ff0044" });
	    this.load.video('test', 'assets/sound/test.mp4');
};
var video1;*/
video.prototype.create = function() {
	
		this.input.onDown.active = true;
		this.bg = this.add.sprite(0,0,"g1");
	//
	//
	this.input.onDown.add(this.startLevel, this);
	
	/*
	 video1 = this.add.video('test');

	    video1.play();

	    //  x, y, anchor x, anchor y, scale x, scale y
	    video1.addToWorld();
	    video1.onComplete.addOnce(this.startLevel, this);
	*/
};


	video.prototype.startLevel = function(){
	this.game.state.start("video2");
	};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



