import Heart from './Heart'

var larray = [];

export default class extends Phaser.Sprite {

	constructor ({ game, x, y, asset }) {
    
    super(game, x, y, asset)

	    this.game = game;
	    this.anchor.setTo(0.5);
	    
	    this.smoothed = false;
	    this.scale.setTo(4);

	    this.walkSpeed = Math.random()*50+5;
	    this.lives = 15; //15hp :(
	    this.alive = true;
	    this.jumpTimer = 1500;
	   	this.rejumpTime = Math.random()*3000+3000;

	    this.shootTimer = Math.random()*5000+5000; //between each shot
	    this.refireTime = 5000;
	    this.boneLifeSpan = 1500;

	    this.game.physics.arcade.enable(this);
	    
	    /* Enemy Physics Stuff */
	    this.body.bounce.y = 0.05;
	    this.body.collideWorldBounds = true;
	    this.body.setSize(9,16,3,0) //resize it to 8x16 and middle aligned
	   
	     /* Sounds */
    	this.soundHurt = this.game.sound.add('enemyhit');

	    /* Add sprite animations */
    	this.animations.add('left',[3,4,5],3,true);
    	this.animations.add('right',[7,8,9],3,true);
    	this.animations.add('idle',[0,1,2],3,true);

    	this.treasureGroup = this.game.add.group();
    	this.treasureGroup.enableBody = true;
    	this.treasureGroup.physicsBodyType = Phaser.Physics.ARCADE;
    	this.treasureGroup.createMultiple(10,'heart'); //add 10 lifes to the treasure group
    	this.treasureGroup.setAll('type', 'heart');

    	/* Create Bones Group */
    	
		/* Setup Player Bullet Group */
	    this.bones = this.game.add.group();
	    this.bones.enableBody = true;
	    
	    this.bones.physicsBodyType = Phaser.Physics.ARCADE;
	    this.bones.createMultiple(20,'shot1');
	    
	    this.bones.setAll('checkWorldBounds',true);
	    this.bones.setAll('outOfBoundsKill', true);
	    this.bones.setAll('lifespan',this.bulletLifeSpan);
	    this.bones.setAll('type', 'bone');
	
    	/* Scope Binding */
    	this.onHit = this.onHit.bind(this);
    	this.die = this.die.bind(this);
    	this.shoot = this.shoot.bind(this);
    	this.resetBone = this.resetBone.bind(this);
    	this.moveLeft = this.moveLeft.bind(this);
    	this.moveRight = this.moveRight.bind(this);
    	this.drawLives = this.drawLives.bind(this);	

	}

	resetBone(bone){
		//console.log('ENEMY: Bone: OOB - Destroy')
		bone.kill();
	}
	
	drawLives() {

		/* Destroy Meter */  
		for(var a=0;a<larray.length;a++){
			larray[a].destroy();
		}

		/* Draw Meter */
		for(var i=0;i<this.lives;i++){
			if(i===0) { 
	          var life = this.game.add.sprite(125,45,'enemylife');
	        } else {
	          var life = this.game.add.sprite(13*i+125,45,'enemylife');
	        }
			life.scale.setTo(1,2);
			life.fixedToCamera = true;
			larray.push(life);
		}
	}

	die() {
		this.alive = false;
		this.body.enable = false; // destroy all physics on die
		var dieEffect = this.game.add.tween(this).to({alpha:0},500,"Linear",true);
		dieEffect.onComplete.add(function(){
			var dropChance = Math.round(Math.random()*3);
			if(dropChance === 1) {
				var treasure = this.treasureGroup.getFirstDead();
				treasure.reset(this.x,this.y);
			}
			this.kill();
		}, this);
	}
	
  	shoot() {
  	  console.log('shoot');
  	  var bone = this.bones.getFirstDead();
      bone.body.gravity.y = -1500; //even gravity -- horizontal shot
      bone.scale.set(4);
      bone.reset(this.x,this.y) //reset bullet ontop of player 
      bone.lifespan = this.boneLifeSpan; //weak ass
      if(this.frame === 7 || this.frame === 8 || this.frame === 9 ? bone.body.velocity.x = 300 : bone.body.velocity.x = 300 * -1); //which side to fire on  
          
      this.shootTimer = this.game.time.now + this.refireTime;
  	}
	
	jump() {
		//console.log('ENEMY: Jump');
		
		this.body.velocity.y=-600;
		this.jumpTimer = this.game.time.now + this.rejumpTime; //3s?
	}

	moveLeft() {
		this.body.velocity.x = this.walkSpeed * -1;
		this.animations.play('left');
	}

	moveRight() {
		this.body.velocity.x = this.walkSpeed;
		this.animations.play('right');
	}
	
	onHit(spr1,spr2) {
		
		this.lives--;
		this.drawLives();

		this.soundHurt.volume = 0.25;
		this.soundHurt.play();
		
		if(this.lives>0){
			
			if(spr2.x<this.x) {
				this.animations.play('left');
			}else {
				this.animations.play('right');
			}

			var hitEffect = this.game.add.tween(this).to({alpha:0},100,"Linear",true);
	        hitEffect.onComplete.add(function(){
	        	this.game.add.tween(this).to({alpha:1},100,"Linear",true);
	      	}, this);
      	
      		spr2.kill(); //bullet
		
      	}

		if(spr2.x<this.x ? this.x+=16 : this.x-=16);
		
		if(this.lives === 0){
			this.die();
		}
		
	}

	update() {
		
		//if(this.bones) this.bones.rotation += 1;
		this.bones.forEach(function(bone){
			bone.rotation += 1;
		});

		this.treasureGroup.forEach(function(treasure){
			//treasure.scale.x *= -0.5;
		})
		
		if(this.alive===true){
			switch(this.facing){
				case 'left':
					this.moveLeft();
					break;
				case 'right':
					this.moveRight();
					break;
			}
			if(this.game.time.now > this.jumpTimer) {
				this.jump();
			}
			if(this.game.time.now > this.shootTimer){
				this.shoot();
			}
		}
	}
}