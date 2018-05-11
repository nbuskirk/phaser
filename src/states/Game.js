/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'
import Skull from '../sprites/Skull'

import {setResponsiveWidth} from '../utils'
import { centerGameObjects } from '../utils'

var typewriter;
var map, ml_ground, ml_objects, ml_foreground, fx; //map layers ml_
var larray = [];

export default class extends Phaser.State {
  
  init () {
   
   this.game.input.onDown.addOnce(() => {
      this.game.sound.context.resume();
    });
   
  }

  create () {
   
    this.game.sound.stopAll();
    
    this.music = this.game.add.audio('music2');
    this.music.loopFull(0.25); //bgm
    
    var bg = this.game.add.tileSprite(0,-400,1920,1080,'background2'); //background sprite
    bg.fixedToCamera = true;

    map = this.game.add.tilemap('level1');
    map.addTilesetImage('tiles','tiles');
    map.setCollisionBetween(0, 1);

    ml_ground = map.createLayer('ground');
    ml_objects = map.createLayer('objects');

    ml_objects.smoothed = false;
    ml_objects.setScale(4);
    ml_objects.resizeWorld();

    ml_ground.smoothed = false;
    ml_ground.setScale(4);
    ml_ground.resizeWorld();
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1500;

    /* ENEMY GROUP */
    this.enemies = this.game.add.group();

    /* CREATE ENEMIES FROM OBJECT MARKERS */
    map.objects.enemies.forEach(function(enemy){
      let enemyObject;
      enemyObject = new Enemy({
        game: this.game,
        x: enemy.x*4,
        y: enemy.y*4,
        asset: 'skeleton'
      })
      this.enemies.add(enemyObject);
    }, this)

    var skull = new Skull({
      game: this.game,
      x:250,y:200,
      asset: 'skull'
    })

    this.enemies.add(skull);

    this.player = new Player({
      game: this.game,
      x: 154,
      y: 288,
      asset: 'ms'
    });
    
    this.game.add.existing(this.player)

    //var xp = this.game.add.bitmapText(19, 45, 'pixelFont', 'XP', 18);
    //xp.fixedToCamera = true;

    //follow this.player
    this.game.camera.follow(this.player);

    /* Draw Foreground */
    ml_foreground = map.createLayer('foreground');
    ml_foreground.smoothed = false;
    ml_foreground.setScale(4);
    ml_foreground.resizeWorld();

    this.showMapTitle(map.properties.name);
    
  }
  
  showMapTitle(title){
    this.mapTitle = this.game.add.bitmapText(0, 140, 'pixelFont', title, 24);
    this.mapTitle.x = 320 - (this.mapTitle.width / 2);
    this.mapTitle.fixedToCamera = true;
    this.mapTitle.alpha = 0;
    var titleTween = this.game.add.tween(this.mapTitle).to({alpha:1}, 1000, "Linear", true);
    titleTween.onComplete.add(function(){
      this.game.add.tween(this.mapTitle).to({alpha:0}, 2000, "Linear", true);
    }, this)
  }


  update(){

    /* PLAYER PHYSICS */
    this.game.physics.arcade.collide(this.player, ml_ground);
    this.game.physics.arcade.collide(this.player.bullets, ml_ground);
//    this.game.physics.arcade.overlay(this.player, enemy.bones, player.onHit, null, false)

    /* ENEMY PHYSICS */
    this.enemies.forEach(function(enemy){
      this.game.physics.arcade.collide(enemy, ml_ground);
      this.game.physics.arcade.collide(enemy.treasureGroup, ml_ground);
      this.game.physics.arcade.overlap(enemy.treasureGroup, this.player, this.player.collectTreasure, null, false);
      this.game.physics.arcade.overlap(this.player, enemy, this.player.onHit, null, false);
      this.game.physics.arcade.overlap(this.player.bullets, enemy, enemy.onHit, null, false);
      this.game.physics.arcade.overlap(this.player, enemy.bones, this.player.onHit, null, false);  
      if(this.player.x < enemy.x ? enemy.facing = 'left' : enemy.facing = 'right');
    }, this)

  }
  
  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.player, 15, 45)
    }
  }

}
