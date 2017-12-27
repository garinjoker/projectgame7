/**
 * Menu state.
 */
function Menu() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Menu.prototype = proto;

Menu.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
};

Menu.prototype.create = function() {
	this.bg = this.add.sprite(0,0,"bg");

	var sprite = this.add.sprite(this.world.centerX, this.world.centerY,"tap-to-start");
	//sprite.scale.set(0.1);
	sprite.anchor.set(0.5, 0.5);
	
	var sprite1 = this.add.sprite(this.world.centerX+77, this.world.centerY-257,"storyt");
	//sprite.scale.set(0.1);
	sprite1.anchor.set(0.5, 0.5);
	sprite1.inputEnabled = true;
	sprite1.events.onInputDown.add(this.startstory, this);
		var text = this.add.text(10, this.world.height-20, "By LOTUS SOAR",
		 {fill: 'white'});
		text.scale.set(0.4);
		this.ship = this.add.sprite(this.world.centerX, this.world.height-20,"ship1");
		this.ship.animations.add("all").play(12,true);
		this.ship.anchor.set(0.5,1);
		this.ship.scale.set(0.2);
		this.ship.smoothed = false;
		this.input.onDown.active = true;
		
	//
	//
	this.input.onDown.add(this.startGame, this);
	//
	
	
	//
};

Menu.prototype.startGame = function() {
	this.input.onDown.active = false;
	var tw = this.add.tween(this.ship);
	tw.to({y:10},3500, "Elastic.easeIn",true);
	tw.onComplete.addOnce(this.startLevel, this);
	};
	Menu.prototype.startLevel = function(){
	this.game.state.start("Level");
	};
	Menu.prototype.startstory = function(){
		this.game.state.start("video");
		};
