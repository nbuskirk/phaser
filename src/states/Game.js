/*

Haunted Castle Alpha

Tiled map contains 5 layers, these are drawn and added to the level.

  OBJECT LAYERS: 
    interactables: torches, braziers, interactable, destructable items. 
      GROUP: levelObjects
    enemies: skeletons(for now), placed. 
      GROUP: enemies
  TILE LAYERS:
    objects: grass, tiles behind the player.
    foreground: grass, plants, tiles in front of the player.
    ground: the ground.

*/


/* globals __DEV__ */
import Phaser from 'phaser' //Engine
import Player from '../sprites/Player'  //Our Hero
import Skeleton from '../sprites/Skeleton'    //Skeleton
import Skull from '../sprites/Skull'    //Flying Skulls
import Torch from '../sprites/Torch'    //Torches

/* Support Functions */
import {setResponsiveWidth} from '../utils'
import { centerGameObjects } from '../utils'

/* GAME OPTIONS */
import GameOptions from '../options'

var typewriter;
var map, ml_ground, ml_objects, ml_foreground; //map layers ml_
var larray = [];
var skullTimer = 0;

export default class extends Phaser.State {
  
  init () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1500;
   
    if(GameOptions.musicEnabled){
      this.game.input.onDown.addOnce(() => {
        this.game.sound.context.resume();
      });
      
      this.game.sound.stopAll();
      this.music = this.game.add.audio('music2');
      this.music.volume = GameOptions.gameVolume;
      this.music.loopFull(); //bgm
    }

    this.spawnSkull = this.spawnSkull.bind(this);

  }

  create () {
    
    /* TILED MAP LAYERS */
    map = this.game.add.tilemap('level1');
    map.addTilesetImage('tiles','tiles');
    map.setCollisionBetween(0, 1);

    ml_ground = map.createLayer('ground');
    ml_objects = map.createLayer('objects');

    ml_objects.smoothed = false;
    ml_objects.setScale(GameOptions.spriteScale);
    ml_objects.resizeWorld();

    ml_ground.smoothed = false;
    ml_ground.setScale(GameOptions.spriteScale);
    ml_ground.resizeWorld();
    
    /* GAME TREASURE POOL */
    this.game.treasureGroup = this.game.add.group();
    this.game.treasureGroup.enableBody = true;
    this.game.treasureGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.game.treasureGroup.createMultiple(10,'heart'); //add 10 lifes to the treasure group
    this.game.treasureGroup.setAll('type', 'heart');
    this.game.treasureGroup.setAll('body.bounce.y', 0.45); //bouncy :)
    this.game.treasureGroup.setAll('outOfBoundsKill',true); 

    /* ENEMY GROUP */
    this.enemies = this.game.add.group();
    
    /* ITEM GROUP */
    this.levelObjects = this.game.add.group();

    /* CREATE ENEMIES FROM OBJECT MARKERS */
    map.objects.enemies.forEach(function(enemy){
      let enemyObject;
      enemyObject = new Skeleton({
        game: this.game,
        x: enemy.x*GameOptions.spriteScale,
        y: enemy.y*GameOptions.spriteScale
      })
      this.enemies.add(enemyObject);
    }, this)

    map.objects.interactables.forEach(function(obj){
      let itemObject;
      itemObject = new Torch({
        game: this.game,
        x: obj.x*GameOptions.spriteScale,
        y: obj.y*GameOptions.spriteScale
      })
      this.levelObjects.add(itemObject);
    }, this)

    this.player = new Player({
      game: this.game,
      x: 0,
      y: 148
    });
  
    this.game.add.existing(this.player);
    this.game.camera.follow(this.player);

    /* MAP FOREGROUND */
    ml_foreground = map.createLayer('foreground');
    ml_foreground.smoothed = false;
    ml_foreground.setScale(GameOptions.spriteScale);
    ml_foreground.resizeWorld();

    /* SHOW LEVEL NAME */
    this.showMapTitle(map.properties.name);
    
  }
  spawnSkull() {
    var skull = new Skull({
      game: this.game,
      x:this.player.x+640,y:260,
      asset: 'skull'
    })
    skull.power = 2;
    this.enemies.add(skull);
    skullTimer = this.game.time.now + 5000;
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
    this.game.physics.arcade.collide(this.player.equippedItemGroup, ml_ground);
    this.game.physics.arcade.collide(this.game.treasureGroup, ml_ground);
    this.game.physics.arcade.overlap(this.game.treasureGroup, this.player, this.player.collectTreasure, null, false);
    
    /* ITEM GROUP */
    this.levelObjects.forEach(function(item){
      this.game.physics.arcade.collide(item, ml_ground);
      this.game.physics.arcade.overlap(this.player.bullets, item, item.onHit, null, false);
      this.game.physics.arcade.overlap(this.player.equippedItemGroup, item, item.onHit, null, false);
    }, this)

    /* ENEMY GROUP */
    this.enemies.forEach(function(enemy){
      this.game.physics.arcade.collide(enemy, ml_ground);
      this.game.physics.arcade.overlap(this.player, enemy, this.player.onHit, null, false);
      this.game.physics.arcade.overlap(this.player.bullets, enemy, enemy.onHit, null, false);
      this.game.physics.arcade.overlap(this.player.equippedItemGroup, enemy, enemy.onHit, null, false);
      this.game.physics.arcade.overlap(this.player, enemy.bones, this.player.onHit, null, false);  
      if(this.player.x < enemy.x ? enemy.facing = 'left' : enemy.facing = 'right');
    }, this)

    if(this.game.time.now > skullTimer) {
      this.spawnSkull();
    }

  }
  
  render () {
    if (__DEV__) {
      //this.game.debug.body(this.player, 15, 45)
    }
  }

}
