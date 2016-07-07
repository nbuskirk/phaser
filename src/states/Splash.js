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
    this.game.load.spritesheet('ms', './assets/images/template.png',16,16,16) //player
    this.game.load.tilemap('level1','./assets/levels/level1.json',null,Phaser.Tilemap.TILED_JSON) //level data
    this.game.load.image('tiles','./assets/images/tiles.png')
    this.game.load.image('shot1','./assets/images/shot2.png')
    this.game.load.image('shot2','./assets/images/particle_1.png')

  }

  create () {
    this.state.start('Game')
  }

}
