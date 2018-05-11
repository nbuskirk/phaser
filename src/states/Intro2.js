import Phaser from 'phaser'
import Player from '../sprites/Player'

var selectButton, pad1, player, bg;
var typewriter;
var allowInput = false;

export default class extends Phaser.State {
  
  init () {
    this.stage.backgroundColor = '#000' 
    
    /* Music */
    this.game.sound.stopAll();
    this.music = this.game.add.audio('intro');
    this.music.play(); 
    this.music.volume = 0.25;
    
    pad1 = this.game.input.gamepad.pad1;

    this.startGame = this.startGame.bind(this); 

    this.game.input.onDown.addOnce(() => {
      this.game.sound.context.resume();
    });

  }

  create () {
    bg = this.game.add.sprite(0,0,'castle'); //bg spr

    this.player = new Player({
      game: this.game,
      x: 640,
      y: 237,
      asset: 'ms'
    });
    
    this.player.meterVisible = false;
    this.player.controlsEnabled = false;

    //add player to game
    this.game.add.existing(this.player)
    this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;

    //enable physics on the player sprite
    //this.game.physics.enable(player,Phaser.Physics.ARCADE)
  }
  
  startGame () {
    this.state.start('Game'); //if we are on game start start game scene
  }
  update () {
    if(this.player.x>335){
      this.player.animations.play('left');
      this.player.x-=1;
    } else {
      this.player.animations.play('lookup');
      var fade = this.game.add.tween(this.player).to({alpha:0},3000,"Linear",true);
      fade.onComplete.add(function(){this.state.start('Game')},this);
    }

  }

}
