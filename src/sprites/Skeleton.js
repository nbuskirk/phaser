import GameOptions from '../options';

var larray = [];

export default class extends Phaser.Sprite {
  
  constructor ({ game, x, y }) {
    
	super(game, x, y, 'skeleton')

	this.game = game;
	this.anchor.setTo(0.5);
	this.smoothed = false;
	this.game.physics.arcade.enable(this);
	this.scale.setTo(GameOptions.spriteScale);
	this.enemyIndex = null;
	this.rare = false;

	if(Math.round(Math.random()*3) === 1) {
		console.log("RARE SPAWNED - U DEAD!");
		this.rare = true;
		this.tint = '0xff6969';
	}

	/* SKELETON DEFAULTS */
	GameOptions.enemyTypes.map((enemy, index) => {
		if(enemy.name === 'skeleton') {
			this.enemyIndex = index;
			if(!this.rare) { 
				this.lives = enemy.lives;
				this.power = enemy.power;
			} else {
				this.lives = enemy.lives * 2;
				this.power = enemy.power * 2;
			}
		}
	});

	/* SKELETON TIMERS -- DO NOT CHANGE */
	this.hitTimer = 0;
	this.jumpTimer = 0;
	this.shootTimer = 0;
	
	/* SKELETON PHYSICS */
	this.body.setSize(9,16,3,0) //resize it to 8x16 and middle aligned
	this.outOfBoundsKill = true;
		
	 /* SKELETON SOUNDS */
	this.soundHurt = this.game.sound.add('enemyhit');

	if(GameOptions.soundsEnabled) {
		this.soundHurt.volume = GameOptions.gameVolume;
	} else {
		this.soundHurt = 0;
	}

	/* SKELETON ANIMATIONS */
	this.animations.add('left',[3,4,5],3,true);
	this.animations.add('right',[7,8,9],3,true);
	this.animations.add('idle',[0,1,2],3,true);

	/* WEAPON GROUP */
	this.bones = this.game.add.group();
	this.bones.enableBody = true;
	this.bones.physicsBodyType = Phaser.Physics.ARCADE;
	this.bones.createMultiple(20,'shot1');
	this.bones.setAll('checkWorldBounds',true);
	this.bones.setAll('outOfBoundsKill', true);
	this.bones.setAll('body.gravity.y', GameOptions.enemyTypes[this.enemyIndex].weapons[0].gravity.y);
	if(this.rare) {
		this.bones.setAll('tint','0xFF0000');
	};

	/* FUNCTIONS */
	this.onHit = this.onHit.bind(this);
	this.die = this.die.bind(this);
	this.shoot = this.shoot.bind(this);
	this.resetBone = this.resetBone.bind(this);
	this.moveLeft = this.moveLeft.bind(this);
	this.moveRight = this.moveRight.bind(this);
	this.drawLives = this.drawLives.bind(this);	

  }

	resetBone(bone){
		bone.kill();
	}
	
	drawLives() {
		for(var a=0;a<larray.length;a++){
			larray[a].destroy();
		}
		
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
		this.body.enable = false; // destroy all physics on die
		var dieEffect = this.game.add.tween(this).to({alpha:0},500,"Linear",true);
		dieEffect.onComplete.add(function(){
			var dropChance = Math.round(Math.random()*3);
			if(dropChance === 1) {
				var treasure = this.game.treasureGroup.getFirstDead();
				treasure.reset(this.x,this.y);
			}
			this.destroy();
		}, this);
	}
	
  	shoot() {
		try {
			var bone = this.bones.getFirstDead();
			bone.reset(this.x,this.y) //reset bullet ontop of player 
			bone.scale.set(GameOptions.spriteScale);
			if(!this.rare) {
				bone.power = GameOptions.enemyTypes[this.enemyIndex].weapons[0].power;
			} else {
				bone.power = GameOptions.enemyTypes[this.enemyIndex].weapons[0].power * 4;
			}
			bone.lifespan = GameOptions.enemyTypes[this.enemyIndex].weapons[0].lifespan;
			if(this.frame === 7 || this.frame === 8 || this.frame === 9 ? bone.body.velocity.x = 300 : bone.body.velocity.x = 300 * -1); //which side to fire on  
			if(!this.rare){
				this.shootTimer = this.game.time.now + GameOptions.enemyTypes[this.enemyIndex].weapons[0].speed;
			} else {
				this.shootTimer = this.game.time.now + GameOptions.enemyTypes[this.enemyIndex].weapons[0].speed / 2;
			}
		} catch(error) {
			console.log(error);
		}
  	}
	
	jump() {
		this.body.velocity.y = GameOptions.enemyTypes[this.enemyIndex].jumpHeight;
		this.jumpTimer = this.game.time.now + GameOptions.enemyTypes[this.enemyIndex].jumpAgain; //3s?
	}

	moveLeft() {
		this.body.velocity.x = GameOptions.enemyTypes[this.enemyIndex].walkSpeed * -1;
		this.animations.play('left');
	}

	moveRight() {
		this.body.velocity.x = GameOptions.enemyTypes[this.enemyIndex].walkSpeed;
		this.animations.play('right');
	}
	
	onHit(spr1,spr2) {
		
		if(this.game.time.now > this.hitTimer){
        
			this.lives = this.lives - spr2.power;
			
			if(this.lives <= 0){
				this.die();
			}

			this.drawLives();

			this.soundHurt.play();
			
			var hitEffect = this.game.add.tween(this).to({alpha:0},100,"Linear",true);
	        hitEffect.onComplete.add(function(){
	        	this.game.add.tween(this).to({alpha:1},100,"Linear",true);
	      	}, this);

	      	if(spr2.power===1) { spr2.kill(); } //bullet 

			if(spr2.x<this.x ? this.x+=16 : this.x-=16); //face what hit skellyton
			
			if(!this.rare) {
				this.hitTimer = this.game.time.now + GameOptions.enemyTypes[this.enemyIndex].rehitDelay;
			} else {
				this.hitTimer = this.game.time.now + GameOptions.enemyTypes[this.enemyIndex].rehitDelay * 2;
			}
		}
		
	}

	update() {
		
		
		this.bones.forEach(function(bone){
			bone.rotation += 1;
		});
		
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
		if( (this.game.time.now > this.shootTimer) && this.body.enable ){
			this.shoot();
		}
	
	}
}