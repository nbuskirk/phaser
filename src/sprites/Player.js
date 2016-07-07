import Phaser from 'phaser'

var cursors, jumpButton;
var facing='idle';
var jumpTimer = 0;
var pad1;
var emitter;

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.game = game
    this.anchor.setTo(0.5)
    this.animations.add('left',[4,5,6,7],4,true);
    this.animations.add('right',[8,9,10,11],4,true);
    cursors = this.game.input.keyboard.createCursorKeys();
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.gamepad.start();
    pad1 = this.game.input.gamepad.pad1;
    this.emitter = this.game.add.emitter(0,0,1500);
    this.emitter.makeParticles(['shot1','shot2']);
    //this.emitter.gravity = 800;
  }
  particleBurst(pointer){
    this.emitter.x = this.x+16;
    this.emitter.y = this.y;
    this.emitter.start(true,1000,null,2,true);
  }
  update () {
    this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    if(cursors.down.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_B)){
        this.particleBurst();
    }
    this.body.velocity.x = 0;
    if (cursors.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)<-0.1)
    {
       this.body.velocity.x = -150;

       if (facing != 'left')
       {
           this.animations.play('left');
           facing = 'left';
       }
    }
    else if (cursors.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
       this.body.velocity.x = 150;

       if (facing != 'right')
       {
           this.animations.play('right');
           facing = 'right';
       }
    }
    else
    {
       if (facing != 'idle')
       {
           this.animations.stop();

           if (facing == 'left')
           {
               this.frame = 0;
           }
           else
           {
               this.frame = 0;
           }

           facing = 'idle';
       }
    }

    if ( (jumpButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_A)) && this.body.onFloor() && this.game.time.now > jumpTimer)
    {
       this.body.velocity.y = -250;
       jumpTimer = this.game.time.now + 750;
    }

  }

}
