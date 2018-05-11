import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    //this.load.image('mushroom', 'assets/images/frame0.png')
    this.game.load.tilemap('level1','./assets/levels/level1.json',null,Phaser.Tilemap.TILED_JSON) //level data
   
    this.game.load.audio('sfx','./assets/blip.wav') //menu blip
    //this.game.load.audio('music','./assets/haunting.mp3') //menu music
    this.game.load.audio('music2','./assets/level1.mp3') //travel music
    this.game.load.audio('intro','./assets/intro.mp3') //menu music
    this.game.load.audio('shoot','./assets/shoot.wav')
    this.game.load.audio('explode','./assets/fireball.wav')
    this.game.load.audio('hurt','./assets/hurt.wav')
    this.game.load.audio('enemyhit','./assets/enemyhit.wav')
    this.game.load.audio('heart','./assets/heart.wav')

    this.game.load.spritesheet('ms', './assets/images/template.png',16,16,16) //player
    this.game.load.spritesheet('skeleton', './assets/images/template2.png',16,16,9) //skeleton
    this.game.load.spritesheet('skull', './assets/images/skull.png',16,23,12) //skull
    

    this.game.load.spritesheet('torch', './assets/images/torch2.png',32,43,4)
   
    this.game.load.image('background1','./assets/images/background1.png')
    this.game.load.image('background2','./assets/images/background2.png')
    this.game.load.image('castle','./assets/images/castle.png')
    this.game.load.image('tiles','./assets/images/tiles.png')
    this.game.load.image('shot1','./assets/images/shot2.png')
    this.game.load.image('life','./assets/images/playerlife.png')
    this.game.load.image('enemylife','./assets/images/enemylife.png')
    this.game.load.image('bone','./assets/images/bone.png');
    this.game.load.image('heart','./assets/images/heart.png')
    this.game.load.image('interfacebg','./assets/images/interfacebg.png')
   
    this.game.load.bitmapFont('pixelFont','./assets/font.png', './assets/font.fnt');

  }

  create () {
    this.state.start('Menu')
  }

}
