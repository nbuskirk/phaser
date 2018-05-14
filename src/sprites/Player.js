import GameOptions from '../options';

var larray = []; //life array
var sarray = []; //special items

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {

    super(game, x, y, 'ms');
    
    this.game = game;
    this.anchor.setTo(0.5);
    this.smoothed = false;
    this.game.physics.arcade.enable(this)
    this.scale.setTo(GameOptions.spriteScale);
    
    /* PLAYER DEFAULTS */
    this.maxLife = GameOptions.playerOptions.life;
    this.lives = GameOptions.playerOptions.life;
    this.special_item_count = GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].count;
    this.walkSpeed = GameOptions.playerOptions.walkSpeed;
    this.uiVisible = GameOptions.uiVisible;
    this.facing = 'idle'; 
    this.jumping = false;
    this.controlsEnabled = true;

    /* PLAYER TIMERS -- DO NOT CHANGE*/
    this.jumpTimer = 0;
    this.shootTimer = 0;
    this.hitTimer = 0;
    this.currentVelocity = 0;
    this.dashTimer = 0;
    this.equippedItemTimer = 0;
    
    /* PLAYER PHYSICS */
    this.body.bounce.y = 0;
    this.body.collideWorldBounds = true;
    this.body.setSize(8,16,4,0) //resize it to 8x16 and middle aligned
    
    /* PLAYER SOUNDS */
    this.soundHurt = this.game.sound.add('hurt');
    this.soundShoot = this.game.sound.add('shoot');
    this.soundHeart = this.game.sound.add('heart');
    this.soundHolyWater = this.game.sound.add('holywater');

    /* Set Volume Levels */
    if(GameOptions.soundsEnabled) {
      this.soundHurt.volume = GameOptions.gameVolume;
      this.soundShoot.volume = GameOptions.gameVolume;
      this.soundHeart.volume = GameOptions.gameVolume;
      this.soundHolyWater.volume = GameOptions.gameVolume;
    } else {
      this.soundHurt.volume = 0;
      this.soundShoot.volume = 0;
      this.soundHeart.volume = 0;
      this.soundHolyWater.volume = 0;
    }

    /* PLAYER ANIMATIONS */
    this.animations.add('left',[4,5,6,7],4,true);
    this.animations.add('right',[8,9,10,11],4,true);
    this.animations.add('idle',[0,5,9,13],4,true);
    this.animations.add('lookup',[12],1,true);
    this.animations.add('die', [12,8,0,4],4, false);
    this.animations.add('jump', [9],1,false);
    this.frame = 8; // right frame 1
    
    /* Setup Keyboard LEFT/RIGHT/SPACE/Z */
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.jumpButton = this.game.input.keyboard.addKey(GameOptions.controls.jump);
    this.shootButton = this.game.input.keyboard.addKey(GameOptions.controls.shoot);
    this.sprintButton = this.game.input.keyboard.addKey(GameOptions.controls.sprint)
    
    /* GAMEPAD */
    this.gamepad = this.game.input.gamepad.pad1;
    
    /* BULLET GROUP */
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20,'shot1');
    this.bullets.setAll('checkWorldBounds',true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('body.gravity.y',GameOptions.playerOptions.weapons[0].gravity.y);

    /* SPECIAL ITEM GROUP */
    this.equippedItemGroup = this.game.add.group();
    this.equippedItemGroup.enableBody = true;
    this.equippedItemGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.equippedItemGroup.createMultiple(3, 'holywater');
    this.equippedItemGroup.setAll('outOfBoundsKill', true);
    this.equippedItemGroup.setAll('body.gravity.y', GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].gravity.y);
    this.equippedItemGroup.setAll('body.gravity.x', GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].gravity.x);

    /* FUNCTIONS */
    this.onHit = this.onHit.bind(this);
    this.collectTreasure = this.collectTreasure.bind(this);

    if(this.uiVisible===true){
      this.updateUI(); //draw initial life meter on create
    }

  }
  
  updateUI(){

      var playerText = this.game.add.bitmapText(15, 20, 'pixelFont', 'PLAYER', 18);
      playerText.fixedToCamera = true;

      var enemyText = this.game.add.bitmapText(15, 45, 'pixelFont', 'ENEMY', 18);
      enemyText.fixedToCamera = true;

      /*var item = this.game.add.bitmapText(15, 70, 'pixelFont', 'ITEM', 18);
      item.fixedToCamera = true;
      
      var equippedItem = this.game.add.sprite(125, 70, 'holywater');
      equippedItem.fixedToCamera = true;
      equippedItem.scale.setTo(1,2);*/

      /* Destroy Meter */  
      for(var a=0;a<larray.length;a++){
        larray[a].destroy();
      }
     
      /* Draw Meter */
      for(var i=0;i<this.lives;i++){
        if(i===0) { 
          var life = this.game.add.sprite(125,20,'life');
        } else {
          var life = this.game.add.sprite(13*i+125,20,'life');
        }
        life.scale.setTo(1,2);
        life.fixedToCamera = true;
        larray.push(life);
      }      
    
  }
  
  collectTreasure(obj1, obj2) {
    this.soundHeart.play();
    obj2.body.enabled = false;
    if(this.lives != this.maxLife) this.lives++;
    obj2.kill();
    this.updateUI();
  }
  
  onHit(obj1,obj2){

      if(this.game.time.now > this.hitTimer){

        /* UPDATE UI */
        this.lives = this.lives - obj2.power;
        if(this.lives <= 0) {
          this.game.state.start('GameOver');
        }
        
        this.updateUI();     
        
        /* PLAY SFX */
        this.soundHurt.play();

        /* KNOCKBACK */
        this.walkSpeed = (GameOptions.playerOptions.walkSpeed * -5); //when we get hit, invert the walk speed causing knockback (bound to controls)
        if(this.jumping===false) {
          this.body.velocity.y-=400;
        }
        
        /* SHOW FLASH FX */
        var hitEffect = this.game.add.tween(this).to({alpha:0},100,"Linear",true);
        hitEffect.onComplete.add(function(){
          this.game.add.tween(this).to({alpha:1},100,"Linear",true);
        }, this);
        
        this.hitTimer = this.game.time.now + GameOptions.playerOptions.rehitDelay;

      }
      
  }

  jump() {
    if(this.body.onFloor() && this.game.time.now > this.jumpTimer) {
      this.jumping = true;
      this.body.velocity.y = GameOptions.playerOptions.jumpHeight;
      this.jumpTimer = this.game.time.now + GameOptions.playerOptions.jumpAgain;
    }
  }

  dash() {
    this.walkSpeed = GameOptions.playerOptions.walkSpeed * 2;
  }

  shoot() {
      if(this.game.time.now > this.shootTimer) {
        try { // try to get a bullet, don't crash if we don't
          var bullet = this.bullets.getFirstDead();
          bullet.reset(this.x,this.y) //reset bullet ontop of player 
          bullet.scale.set(GameOptions.spriteScale);
          bullet.lifespan = GameOptions.playerOptions.weapons[0].lifespan;
          bullet.power = GameOptions.playerOptions.weapons[0].power;
          if(this.frame === 8 || this.frame === 9 || this.frame === 10 || this.frame === 11 ? bullet.body.velocity.x = GameOptions.playerOptions.weapons[0].strength : bullet.body.velocity.x = GameOptions.playerOptions.weapons[0].strength * -1); //which side to fire on  
          this.soundShoot.play();
          this.shootTimer = this.game.time.now + GameOptions.playerOptions.weapons[0].speed;
        }
        catch(error) {
          console.log('Bullet group depleted..');
        }
      }
  }

  shootEquippedItem() {
    if(this.game.time.now > this.equippedItemTimer){
        if(this.special_item_count!=0){
          var item = this.equippedItemGroup.getFirstDead();
          if(this.frame === 8 || this.frame === 9 || this.frame === 10 || this.frame === 11 ? item.reset(this.x+32,this.y-32) : item.reset(this.x-32,this.y-32));
          item.scale.set(GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].scale);  
          item.lifespan = GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].lifespan; 
          item.power = GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].power;
          item.body.velocity.y =  GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].velocity.y;
          if(this.frame === 8 || this.frame === 9 || this.frame === 10 || this.frame === 11 ? item.body.velocity.x = GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].velocity.x : item.body.velocity.x = GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].velocity.x * -1); //which side to fire on  
          this.soundHolyWater.play();
          this.game.add.tween(item).to({width:0, height:0}, 1000, "Linear", true);
          this.special_item_count--;
        }
      this.equippedItemTimer = this.game.time.now + GameOptions.playerOptions.weapons[GameOptions.playerOptions.equippedItem].speed;
    }
  }
  
  update () {
    
    this.body.velocity.x = 0;
   
    this.equippedItemGroup.forEach(function(item){
      item.tint = '0x498eff';
      if(item.body.onFloor()) item.tint = '0xffffff';
    });

    if(this.body.onFloor()) {
      this.jumping = false;
    }  

    if(this.controlsEnabled) {
      /* =========================== RIGHT ===============================*/
      if ( this.cursors.right.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ) {
         
         this.body.velocity.x = this.walkSpeed;

         if (this.facing != 'right') {
             this.animations.play('right', 8, true);
             this.facing = 'right';
         }
         
        if (this.cursors.up.isDown && this.shootButton.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_B) && this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {
          this.shootEquippedItem();
        }

      }
      /* =========================== LEFT ===============================*/
      else if ( this.cursors.left.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ) {
         
         this.body.velocity.x = this.walkSpeed * -1;

         if (this.facing != 'left') {
             this.animations.play('left', 8, true);
             this.facing = 'left';
         }

         if (this.cursors.up.isDown && this.shootButton.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_B) && this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {
          this.shootEquippedItem();
         }

      }

      else if (this.cursors.up.isDown && this.shootButton.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_B) && this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {
      this.shootEquippedItem();
      }

      /* =========================== IDLE ===============================*/
      else {
        if(this.facing != 'idle') {
          this.animations.stop();
          if(this.facing == 'left') { this.frame = 4; } //face left on key up.
          else { this.frame = 8; }
          this.facing = 'idle';
        }
      }    

      /* JUMP */
      if ( (this.jumpButton.isDown || this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A))) {
        this.jump();
      }

      /* SHOOT */
      if( (this.shootButton.isDown || this.gamepad.justPressed(Phaser.Gamepad.XBOX360_B))) {  
        this.shoot();
      }
      
      /* DASH */
      if( (this.sprintButton.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_X))) {  
        this.dash();
      } else {
        this.walkSpeed = GameOptions.playerOptions.walkSpeed;
      }
      
    }//controls

    }

  

}
