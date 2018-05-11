import Phaser from 'phaser'
import WebFont from 'webfontloader'

var cursors, selectButton, dot, gameMenu, pad1, sfx, bg;
var selectTimer = 0;
var backgroundSpeed = 60000; // milliseconds


import {centerGameObjects} from '../utils'
export default class extends Phaser.State {
  
  init () {
    

    this.game.input.gamepad.start();
    pad1 = this.game.input.gamepad.pad1;
    cursors = this.game.input.keyboard.createCursorKeys();

    gameMenu = [
      { label: 'HAUNTED CASTLE', x: this.world.centerX, y: 100},
      { label: 'GAME START', x: this.world.centerX, y: 180},
      { label: 'PASS WORD', x: this.world.centerX, y: 220}
    ]

    /* Menu Sound FX */
    this.sfx = this.game.add.audio('sfx');
    this.sfx.addMarker('blip',0,0.25);
    
    this.game.input.onDown.addOnce(() => {
      this.game.sound.context.resume();
    });

    this.actionOnClick = this.actionOnClick.bind(this);  

  }

  create () {

    bg = this.game.add.sprite(-640,0,'background1'); //bg spr
    this.startBackgroundTween(); //bg animation slide

    /* Draw Menu Items */
    var _this = this;
    for(var i=0;i<gameMenu.length;i++){
      let text = _this.add.bitmapText(gameMenu[i].x, gameMenu[i].y, 'pixelFont', gameMenu[i].label, 24);
      centerGameObjects([text])
    }    

    /* Add Cursor */
    dot = this.add.text(this.world.centerX-150, gameMenu[1].y-18, '*', { font: '25px Press Start 2P', fill: '#777', align: 'center' })
    //dot = _this.add.bitmapText(this.world.centerX-200, gameMenu[1].y-18, 'pixelFont', '*', 24);    
    
    let footerText = this.game.add.bitmapText(15, this.world.height-25, 'pixelFont', 'ALPHA VERSION', 14);
    footerText.tint = '0x777777';

    /* Setup Keyboard */
    selectButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    selectButton.onDown.add(this.actionOnClick);
    
  }

  startBackgroundTween() {
    var bounce = this.game.add.tween(bg);
    var xpos;
    if(bg.x==-640 ? xpos = 0 : xpos = -640);
    bounce.to({x: xpos }, backgroundSpeed, Phaser.Easing.Linear.In);
    bounce.onComplete.add(this.startBackgroundTween, this);
    bounce.start();
  }
  
  actionOnClick () {
     if (dot.y===gameMenu[1].y-18) this.state.start('Game'); //if we are on game start start game scene
  }

  update () {
    if( (cursors.down.isDown || cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)) && this.game.time.now > selectTimer) {
      if (dot.y===gameMenu[1].y-18 ? dot.y=gameMenu[2].y-18 : dot.y=gameMenu[1].y-18);
      this.sfx.play('blip');
      this.sfx.volume = 0.10;
      selectTimer = this.game.time.now + 250;
    }
    if(pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
      this.actionOnClick();
    }  
  }
  render(){
    //this.game.debug.soundInfo(this.music,10,10)
    //this.game.debug.soundInfo(this.sfx,10,150)
  }

}
