
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
	    this.body.outOfBoundsKill = true;
	    //this.body.setSize(9,16,3,0) //resize it to 8x16 and middle aligned
	   
	    /* Add sprite animations */
    	this.animations.add('left',[9,10,11],3,true);
    	//this.animations.add('right',[7,8,9],3,true);
    	//this.animations.add('idle',[0,1,2],3,true);

    	this.body.gravity.y = -1500;

    	this.animations.play('left');

    	this.points = {
    		'x': [640,320,0],
    		'y': [this.game.height/2,450,this.game.height/2]
    	}

    	this.increment = 1 / this.game.width;
    	this.i = 0;
    	this.timer1Stopped = true;
    	this.timer1 = null;

    	this.plot = this.plot.bind(this);

	}
	
	plot() {
		var posx = this.game.math.bezierInterpolation(this.points.x, this.i);
    	var posy = this.game.math.bezierInterpolation(this.points.y, this.i); 
    	this.x = posx;
    	this.y = posy;
    	this.i += this.increment;

    	if(posx > 640) {
    		this.timer1.stop();
    		this.timer1.destroy();
    		this.i = 0;
    		this.timer1Stopped = true;
    	}
	}

	update() {
		
		if(this.timer1Stopped) {
			this.timer1Stopped = false;
			this.timer1 = this.game.time.create(true);
			this.timer1.loop(.01, this.plot, this);
			this.timer1.start();
		}
		
		
	}
}