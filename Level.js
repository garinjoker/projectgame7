function Level() {
	Phaser.State.call(this);
}

var proto = Object.create(Phaser.State);
Level.prototype = proto;
///
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var difficulty = 1;
///
Level.prototype.create = function() {
	this.bg = this.add.sprite(0,0,"bg");
 this.game.score = 0;
 this.gameover=false;
 this.physics.startSystem(Phaser.Physics.ARCADE);
 this.player = this.add.sprite(this.world.centerX,555,"ship1");
 this.player.anchor.set(0.5,0.5);
 this.player.animations.add("fly");
 this.player.play("fly",12,true);
 this.player.smoothed=false;
 this.player.scale.set(0.15);
 this.physics.enable(this.player, Phaser.Physics.ARCADE);
 this.player.body.collideWorldBounds = true;
 this.player.body.allowGravity = false;
 this.player.body.maxVelocity.setTo(200,2000);
 this.createAlien();
 this.createWeapon();
 this.scoreText = this.add.text(32, 0, ''+this.game.score, { fill: 'white' });
 this.scoreText.z = 10;
 
 
 ////
 this.enemyBullets = this.add.group();
 this.enemyBullets.enableBody = true;
 this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
 this.enemyBullets.createMultiple(3, 'a3');
 //this.enemyBullets.setAll('scale', 0.5);
 this.enemyBullets.setAll('anchor.x', 0.5);
 this.enemyBullets.setAll('anchor.y', 0.5);
 this.enemyBullets.setAll('outOfBoundsKill', true);
 this.enemyBullets.setAll('checkWorldBounds', true);
 ////
 
 this.input.keyboard.addKeyCapture([
 Phaser.Keyboard.LEFT,
 Phaser.Keyboard.RIGHT,
 Phaser.Keyboard.SPACEBAR,
 Phaser.Keyboard.X
 ]);
 this.player.inputEnabled = true;
 this.player.events.onInputDown.add(this.fireWeapon, this);
 
 
 
 //////////////////////////////////
 this.player.maxHealth = 6;
 this.player.setHealth(3);
 this.player.events.onKilled.addOnce(this.onPlayerKilled,this);
 this.player.canhit = true;
 
 
 
 this.hp = [];
	for(var i=0;i<this.player.health;i++){
		this.hp[i] = this.add.sprite(this.world.width-20-(5+32)*i,20,"hp");
		this.hp[i].anchor.set(0.5);
		this.hp[i].scale.set(0.5);
		this.hp[i].alpha = 0.6;
		//this.hp[i].animations.add("all").play(12,true);
	}
 
 
//////////////////////////////////////
 //this.boom = this.add.audio("boom");
 //this.boom.allowMultiple=true;
 this.shoot = this.add.audio("shoot");
 this.shoot.allowMultiple=true;
 this.scream = this.add.audio("scream");
 this.sound = this.add.audio("soundbg",1,true);
 this.sound.play();
};
Level.prototype.update = function() {
	if(this.gameover) return;
	 if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
	 this.player.body.acceleration.x = -600;
	 }else if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	 this.player.body.acceleration.x = 600;
	 }else{
	 this.player.body.velocity.setTo(0, 0);
	 this.player.body.acceleration.setTo(0, 0);
	 }
	 if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		 this.fireWeapon();
		 }
	 this.aliens.forEachAlive(function(a){
		 if(a.y > this.world.height) a.y = -Math.random() * 300;
		 },this);
	 
	// this.physics.arcade.collide(this.aliens,this.weapon1.bullets,this.onCollide,null,this);
	 this.physics.arcade.collide(this.aliens,this.weapon2.bullets,this.onCollide,null,this);
	 this.physics.arcade.collide(this.aliens,this.weapon3.bullets,this.onCollide,null,this);
	 this.physics.arcade.collide(this.aliens,this.weapon4.bullets,this.onCollide,null,this);
	// this.physics.arcade.collide(this.aliens,this.weapon5.bullets,this.onCollide,null,this);
	 ////////////////////////////////////////////////////////////
	 
	 //  only move when you click
	    if (this.input.mousePointer.isDown)
	    {
	        //  400 is the speed it will move towards the mouse
	        this.physics.arcade.moveToPointer(this.player, 3100);

	        //  if it's overlapping the mouse, don't move any more
	        if (Phaser.Rectangle.contains(this.player.body, this.input.x, this.input.y))
	        {
	            this.player.body.velocity.setTo(0, 0);
	        }
	    }
	    else
	    {
	      //  this.player.body.velocity.setTo(0, 0);
	    }
	 
	 //////////////////////////////////////////////////////////////
	 if(this.aliens.countLiving()==0 ){
		 ////
		 if(difficulty<3){
				difficulty++;
				this.createAlien();
				return;
			}
		 this.enemyBullets.callAll('kill');
		 ////
		 this.gameover=true;
		 win = this.add.text(this.world.centerX,this.world.centerY,"You Win",{ fill: 'Yellow'});
		 win.anchor.set(0.5,0.5);
		 win.scale.set(0.1);
		 var tw = this.add.tween(win.scale);
		 tw.to({x:2,y:2},1000, "Linear",true,0);

		 delay = this.add.tween(win);
		 delay.to({y:100},1000, "Linear",true,2000);
		 tw.chain(delay);
		 delay.onComplete.addOnce(this.quitGame, this);
		 }
	 
	 ///////////////////////////////////////////////
	 this.physics.arcade.collide(this.aliens,this.weapon2.bullets,this.onCollide,null,this);
	 this.physics.arcade.collide(this.aliens,this.weapon3.bullets,this.onCollide,null,this);
	 this.physics.arcade.collide(this.aliens,this.weapon4.bullets,this.onCollide,null,this);
	 	
	 if(this.player.canhit){
	 this.physics.arcade.collide(this.aliens,this.player,this.onPlayerCollide,null,this);
	 }
	 ///
	 if (this.time.now > firingTimer)
     {
         this.enemyFires();
     }
	 
	 this.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
	 ///
};

Level.prototype.onCollide = function(alien,bullet){
	alien.damage(1);
	bullet.kill();
	
	if(alien.key=='a1'){
		alien.body.velocity.y = 50;
	}else{
		alien.body.velocity.y = 100;
	}
	
	//this.boom.play();
	this.game.score++;
	this.scoreText.text = this.game.score;
	exp = this.add.sprite(alien.x, alien.y,"explosion");
	exp.anchor.set(0.5);
	exp.animations.add("all",null,12,false).play().killOnComplete=true;
	exp.scale.set(2);
	};


/////////////////
	Level.prototype.enemyHitsPlayer = function(player,bullet){
		this.scream.play();
		player.damage(1);
		
		if(this.player.health>=0){
			this.hp[this.player.health].visible = false;
		}
		
		bullet.kill();
		player.canhit = false;
		player.alpha = 0.1;
		var tw = this.add.tween(player);
		tw.to({alpha:1},200, "Linear",true,0,5);
		tw.onComplete.addOnce(function(){this.alpha=1;this.canhit=true;}, player);
		return true;
			};
////////////////
	
	
	
	
Level.prototype.onPlayerCollide = function(player,alien){
	this.scream.play();
	player.damage(1);
	
	if(this.player.health>=0){
		this.hp[this.player.health].visible = false;
	}
	
	alien.kill();
	player.canhit = false;
	player.alpha = 0.1;
	var tw = this.add.tween(player);
	tw.to({alpha:1},200, "Linear",true,0,5);
	tw.onComplete.addOnce(function(){this.alpha=1;this.canhit=true;}, player);
	return true;
		};	

Level.prototype.onPlayerKilled = function(){
	this.gameover=true;
	///
	 this.enemyBullets.callAll('kill');
	////
	 win = this.add.text(this.world.centerX,this.world.centerY,"Your Lose",{ fill: 'Yellow'});
	win.anchor.set(0.5,0.5);
	win.scale.set(0.1);
	var tw = this.add.tween(win.scale);
	tw.to({x:2,y:2},1000, "Linear",true,0);
	delay = this.add.tween(win);
	delay.to({y:100},1000, "Linear",true,2000);
	tw.chain(delay);
	delay.onComplete.addOnce(this.quitGame, this);
		};		
	
Level.prototype.createAlien = function() { 
	this.aliens = this.add.group(this.game.world,'aliens',false,true,Phaser.Physics.ARCADE);
			this.aliens.z = 100;
			//this.aliens.scale.set(1);
			if(difficulty>=3){
				a = this.aliens.create(300,(-Math.random() * 100) ,"a1");
				a.animations.add("fly").play(2,true);
				a.setHealth(30);
				a.anchor.set(0.5);
				a.body.velocity.y = 21;
				a.scale.set(2);
				tw = this.add.tween(a);
				var nx=20+Math.random()*300;
				var nt=Math.random()*500;
				tw.to({x:nx},1000+nt, "Sine",true,0,Number.MAX_VALUE,true);
				return;
			}
			////
		for(var i=0;i<13;i++){
				
			if(difficulty==2){
					a = this.aliens.create(Math.random() * 300,(-Math.random() * 20)*50 ,"a2");
					a.animations.add("fly").play(12,true);
					a.setHealth(5);
					a.anchor.set(0.5);
					a.body.velocity.y = 100;
					a.scale.set(1.5);
					tw = this.add.tween(a);
					var nx=20+Math.random()*300;
					var nt=Math.random()*500;
					tw.to({x:nx},1000+nt, "Sine",true,0,Number.MAX_VALUE,true);
					if(Math.random()>0.5) a.body.angularVelocity = 60;
					else a.body.angularVelocity = -60;
				}
			else{	
				
			a = this.aliens.create(Math.random() * 300,-Math.random() * 300,"a5");
			a.animations.add("fly").play(1,true);
			a.setHealth(1);
			a.anchor.set(0.5);
			a.body.velocity.y = 50;
			tw = this.add.tween(a);
			var nx=20+Math.random()*300;
			var nt=Math.random()*500;
			tw.to({x:nx},1000+nt, "Sine",true,0,Number.MAX_VALUE,true);
			if(Math.random()>0.5) 
				a.body.angularVelocity = 60;
			else 
				a.body.angularVelocity = -60;
			}
			}
};
Level.prototype.createWeapon = function() {
	/*this.weapon1 = this.add.weapon(2,"bullet",0);
	//this.weapon1.play("fly",12,true);
	this.weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon1.trackSprite(this.player,0,-30);
	this.weapon1.bulletSpeed = 500;
	this.weapon1.fireAngle = 248;
	this.weapon1.rate = 400;
	*///this.weapon1.scale.set(3);
	this.weapon2 = this.add.weapon(1,"bullet",1);
	//this.weapon1.play("fly",12,true);
	this.weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon2.trackSprite(this.player,0,-30);
	this.weapon2.bulletSpeed = 500;
	this.weapon2.fireAngle = 259;
	this.weapon2.rate = 400;
	
	this.weapon3 = this.add.weapon(1,"bullet",2);
	//this.weapon1.play("fly",12,true);
	this.weapon3.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon3.trackSprite(this.player,0,-30);
	this.weapon3.bulletSpeed = 666;
	this.weapon3.fireAngle = 270;
	this.weapon3.rate = 400;
	
	this.weapon4 = this.add.weapon(1,"bullet",3);
	//this.weapon1.play("fly",12,true);
	this.weapon4.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon4.trackSprite(this.player,0,-30);
	this.weapon4.bulletSpeed = 500;
	this.weapon4.fireAngle = 281;
	this.weapon4.rate = 400;
	
	/*this.weapon5 = this.add.weapon(2,"bullet",4);
	//this.weapon1.play("fly",12,true);
	this.weapon5.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon5.trackSprite(this.player,0,-30);
	this.weapon5.bulletSpeed = 500;
	this.weapon5.fireAngle = 292;
	this.weapon5.rate = 400;
	//this.weapon2 = this.add.weapon(10,"bullet",2);*/
//	this.weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	//this.weapon2.trackSprite(this.player,20,-30);
	//this.weapon2.bulletSpeed = 500;
	//this.weapon2.fireAngle = 270;
	//this.weapon2.rate = 600;
	//this.weapon2.scale.set(3);
};
Level.prototype.fireWeapon = function() {
	//this.weapon1.fire();
	this.weapon2.fire();
	this.weapon3.fire();
	this.weapon4.fire();
	//this.weapon5.fire();
	//this.shoot.play();
	// this.weapon2.fire();
};


/////////////////////////////////////////////
Level.prototype.enemyFires = function() {

    //  Grab the first bullet we can from the pool
    this.enemyBullet = this.enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    this.aliens.forEachAlive(function(aliens){

        // put every living enemy in an array
        livingEnemies.push(aliens);
    });


    if (this.enemyBullet && livingEnemies.length > 0)
    {
        
        var random=this.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        this.enemyBullet.reset(shooter.body.x, shooter.body.y);

        this.physics.arcade.moveToObject(this.enemyBullet,this.player,120);
        firingTimer = this.time.now + 2579;
    }

};
/////////////////////////////////////////////

Level.prototype.quitGame = function() {
	this.sound.destroy();
	difficulty = 1;
	this.game.state.start("Menu");
};