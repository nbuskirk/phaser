/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import {setResponsiveWidth} from '../utils'

var player;
var map, layer;


export default class extends Phaser.State {
  init () {}
  preload () {

  }
  create () {



    map = this.game.add.tilemap('level1');
    map.addTilesetImage('tiles','tiles');
    map.setCollisionBetween(0, 1);
    layer = map.createLayer('background');
    layer.resizeWorld();

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 450;

    player = new Player({
      game: this.game,
      x: 32,
      y: 0,
      asset: 'ms'
    });
    this.game.add.existing(player)
    this.game.physics.enable(player,Phaser.Physics.ARCADE)
    this.game.camera.follow(player);
  }

  update(){
    this.game.physics.arcade.collide(player, layer);
    this.game.physics.arcade.collide(player.emitter, layer);

  }
  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(player, 32, 32)
    }
  }
}
