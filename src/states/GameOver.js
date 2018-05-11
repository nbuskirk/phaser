import Phaser from 'phaser'

var selectButton, pad1;
var typewriter;
var allowInput = false;

export default class extends Phaser.State {
  
  init () {
    this.stage.backgroundColor = '#000' 
    /* Menu Music */
    this.game.sound.stopAll();
    //this.music = this.game.add.audio('music');
    //this.music.loopFull(0.5); 
    
    pad1 = this.game.input.gamepad.pad1;

    this.startGame = this.startGame.bind(this); 
    this.onDone = this.onDone.bind(this);
  }

  create () {
    
    typewriter = new Typewriter();
    
    typewriter.init(this, {
      x: 150,
      y: 80,
      fontFamily: "pixelFont",
      fontSize: 24,
      maxWidth: 350,
      //sound: reg.track,
      text: "YOU ARE DIED...\n\nPRESS START TO RETRY",
      endFn: this.onDone
    });

    typewriter.start();
  }
  onDone(){
    selectButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    selectButton.onDown.add(this.startGame);
    allowInput = true;
  }
  startGame () {
    this.state.start('Game'); //if we are on game start start game scene
  }
  update () {
    if(pad1.isDown(Phaser.Gamepad.XBOX360_START) && allowInput === true) {
      this.startGame();
    }  
  }

}
