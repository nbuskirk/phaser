import GameOptions from '../options';

export default class extends Phaser.Sprite {

	constructor ({ game, x, y, asset }) {
    
    super(game, x, y, asset)

	    this.game = game;
	    this.anchor.setTo(0.5);
	    
	    this.smoothed = false;
	    this.scale.setTo(3);
	    this.lives = 1;
	    this.type = 'skull';

	    this.game.physics.arcade.enable(this);
	   
	    /* Add sprite animations */
    	this.animations.add('left',[9,10,11],3,true);
    	this.soundHurt = this.game.sound.add('enemyhit');
    	
    	if(GameOptions.soundsEnabled) {
    		this.soundHurt.volume = GameOptions.gameVolume;
    	} else {
    		this.soundHurt = 0;
    	}

    	this.body.gravity.y = -1500;

    	this.animations.play('left');
    	

    	this.direction = 'up';
    	this.onHit = this.onHit.bind(this);
	}
	
	
	onHit(spr1,spr2) {

		this.soundHurt.play();
		this.body.enable = false;
		
		var hitEffect = this.game.add.tween(this).to({alpha:0},200,"Linear",true);
        hitEffect.onComplete.add(function(){
        	var dropChance = Math.round(Math.random()*3);
			if(dropChance === 1) {
				var treasure = this.game.treasureGroup.getFirstDead();
				treasure.reset(this.x,this.y);
				treasure.collideWorldBounds = true;
			}
			this.destroy();
        	
      	}, this);
  	
  		if(spr2.power===1){ spr2.kill(); } //bullet
		
	}
	
	update() {
		//this.game.debug.body(this);
		this.body.velocity.x = -200;

		switch(this.direction){
			case 'up':
				this.body.velocity.y -= 4;
				if(this.body.velocity.y < -150) this.direction = 'down'
				break;
			case 'down':
				this.body.velocity.y += 4;
				if(this.body.velocity.y > 150) this.direction = 'up'
				break;
		}
		//this.angle = 180 - this.game.math.radToDeg(Math.atan2(this.body.velocity.x, this.body.velocity.y));
		
	}
}