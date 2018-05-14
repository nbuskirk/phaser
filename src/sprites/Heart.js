//bullet.js
export default class extends Phaser.Sprite {

	constructor ({ game, x, y, asset }) {
    
    super(game, x, y, asset)
    	this.game = game;
    	this.anchor.setTo(0.5);
    	this.smoothed = false;
    	this.scale.setTo(4);
    	this.game.physics.arcade.enable(this);
	}
	update(){
		
	}

}