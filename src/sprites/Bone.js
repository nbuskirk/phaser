//bullet.js
export default class extends Phaser.Sprite {

	constructor ({ game, x, y, asset }) {
    
    super(game, x, y, asset)

	    this.game = game;
	    this.anchor.setTo(0.5);
	    
	    this.smoothed = false;
	    this.scale.setTo(2);

	    this.game.physics.arcade.enable(this);
	    
	    /* Enemy Physics Stuff */
	    this.body.bounce.y = 0.05;
	    this.body.collideWorldBounds = true;
	    //this.body.setSize(9,16,3,0) //resize it to 8x16 and middle aligned
	    
	}

	update() {
		this.rotation += 0.1;
	}

}