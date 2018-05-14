import GameOptions from '../options';

export default class extends Phaser.Sprite{

	constructor ({ game, x, y, asset }) {
    
    	super(game, x, y, 'torch')

		this.game = game;
		this.smoothed = false;

		this.scale.setTo(4);
		this.lives = 1;
		this.game.physics.arcade.enable(this);
		this.body.setSize(3,16,14,0) //resize it to 8x16 and middle aligned
		this.body.collideWorldBounds = true;

		this.animations.add('flicker', [0,1,2,3], 5, true);
		//this.scale.x *= -1;

		/* Sounds */
		this.soundHurt = this.game.sound.add('enemyhit');
		
		if(GameOptions.soundsEnabled) {
    		this.soundHurt.volume = GameOptions.gameVolume;
    	} else {
    		this.soundHurt = 0;
    	}

		this.animations.play('flicker');
		this.onHit = this.onHit.bind(this);

	
	}

	onHit(spr1,spr2) {

		this.soundHurt.play();
		this.body.enable = false;

		var hitEffect = this.game.add.tween(this).to({alpha:0},100,"Linear",true);
		hitEffect.onComplete.add(function(){
			var dropChance = Math.round(Math.random()*3);
			if(dropChance === 1) {
				var treasure = this.game.treasureGroup.getFirstDead();
				treasure.reset(this.x+48,this.y);
			}
				this.destroy();
			}, this);

			if(spr2.power===1){ spr2.kill(); } //bullet		
	}

	update(){
		//this.game.debug.body(this);
		///this.body.velocity.x = 50;
	}

}