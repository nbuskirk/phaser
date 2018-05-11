import Phaser from 'phaser'

var jumpButton, shootButton, dashButton;

var pad1;
var larray = []; //life array

/* Some configurable player options */
var options = {
  player_ammo_count: 10, //how many to keep in the viewport at once we shouldnt be displaying more than this
  player_shoot_speed: 800, //velocity x
  player_shoot_timeout: 500, //timeout to fire again
  player_walk_speed: 150, //velocity x
  player_jump_height: -500, //velocity y
  player_jump_timeout: 750, //timeout to jump again
  player_rehit_timeout: 750, //how long before we can be hit again
  player_redash_timeout: 500 //how long before we can redash again
}

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    
    //console.log('PLAYER CREATED!');

    super(game, x, y, asset)
    
    this.game = game;
    this.anchor.setTo(0.5);
    
    this.smoothed = false;
    this.scale.setTo(4);

    this.game.physics.arcade.enable(this)
    
    /* PLAYER DEFAULTS -- CHANGE */
    this.maxLife = 16;
    this.lives = 16;
    this.bulletLifeSpan = 150;
    this.facing = 'idle'; // which way to face by default
    this.jumping = false;
    this.controlsEnabled = true;

    /* PLAYER TIMERS -- DO NOT CHANGE*/
    this.jumpTimer = 0;
    this.shootTimer = 0;
    this.hitTimer = 0;
    this.currentVelocity = 0;
    this.dashTimer = 0;

    /* Player Physics Stuff */
    this.body.bounce.y = 0;
    this.body.collideWorldBounds = true;
    this.body.setSize(8,16,4,0) //resize it to 8x16 and middle aligned
    this.body.immovable = true;
    this.meterVisible = true;
    
    /* Sounds */
    this.soundHurt = this.game.sound.add('hurt');
    this.soundShoot = this.game.sound.add('shoot');
    this.soundHeart = this.game.sound.add('heart');

    /* Add sprite animations */
    this.animations.add('left',[4,5,6,7],4,true);
    this.animations.add('right',[8,9,10,11],4,true);
    this.animations.add('idle',[0,5,9,13],4,true);
    this.animations.add('lookup',[12],1,true);
    this.animations.add('die', [12,8,0,4],4, false)
    
    this.frame = 8; // right frame 1
    
    /* Setup Keyboard LEFT/RIGHT/SPACE/Z */
   
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    dashButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);

    /* Setup Gamepad */
    pad1 = this.game.input.gamepad.pad1;
    
    /* Setup Player Bullet Group */
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(options.player_ammo_count,'shot1');
    
    this.bullets.setAll('checkWorldBounds',true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('lifespan',this.bulletLifeSpan);

    this.drawLives = this.drawLives.bind(this);
    this.onHit = this.onHit.bind(this);
    this.collectTreasure = this.collectTreasure.bind(this);

    if(this.meterVisible===true){
      this.drawLives(); //draw initial life meter on create
    }

    /* Bind Scopes */
    this.onHit = this.onHit.bind(this);
    this.drawLives = this.drawLives.bind(this);

  }
  
  drawLives(){
      

      //var score = this.game.add.bitmapText(15, 20, 'pixelFont', 'SCORE', 18);
      //score.fixedToCamera = true;

      var playerText = this.game.add.bitmapText(15, 20, 'pixelFont', 'PLAYER', 18);
      playerText.fixedToCamera = true;

      var enemyText = this.game.add.bitmapText(15, 45, 'pixelFont', 'ENEMY', 18);
      enemyText.fixedToCamera = true;

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

      if(this.lives === 0) {
        this.game.state.start('GameOver');
      }
    
  }

  onWeaponHit(){

  }
  
  collectTreasure(obj1, obj2) {
    this.soundHeart.volume = 0.25;
    this.soundHeart.play();
    if(this.lives != this.maxLife) this.lives++;
    this.drawLives();
    obj2.destroy();
  }
  
  onHit(obj1,obj2){

      if(this.game.time.now > this.hitTimer){

        /* SFX */
        this.soundHurt.volume = 0.25;
        this.soundHurt.play();

        options.player_walk_speed = options.player_walk_speed * -1; //when we get hit, invert the walk speed causing knockback (bound to controls)

        if(this.jumping===false) this.body.velocity.y-=400;
        
        var hitEffect = this.game.add.tween(this).to({alpha:0},200,"Linear",true);
        hitEffect.onComplete.add(function(){
          options.player_walk_speed = options.player_walk_speed * -1;
          this.lives--;
          this.drawLives();     
          this.game.add.tween(this).to({alpha:1},200,"Linear",true);
        }, this);
        
        this.hitTimer = this.game.time.now + options.player_rehit_timeout;

        if(obj2.type==='bone') { obj2.destroy(); }

      }
      
  }

  jump() {
    if(this.body.onFloor() && this.game.time.now > this.jumpTimer) {
      this.jumping = true;
      this.body.velocity.y = options.player_jump_height;
      this.jumpTimer = this.game.time.now + options.player_jump_timeout;
    }
  }

  dash() {
    if(this.body.onFloor()) {
      //dash
      //options.player_walk_speed = options.player_walk_speed * -1;
      //this.currentVelocity = this.currentVelocity * 2;
      //if(this.facing === 'left' ? this.x+=8 : this.x-=8);
   //   this.x-=10;
    }
  }

  shoot() {
      if(this.game.time.now > this.shootTimer) {
        try { // try to get a bullet, don't crash if we don't
          var bullet = this.bullets.getFirstDead();
          bullet.body.gravity.y = -1500; //even gravity -- horizontal shot
          bullet.scale.set(4);
          bullet.reset(this.x,this.y) //reset bullet ontop of player 
          bullet.lifespan = this.bulletLifeSpan; //weak ass
          if(this.frame === 8 || this.frame === 9 || this.frame === 10 || this.frame === 11 ? bullet.body.velocity.x = options.player_shoot_speed : bullet.body.velocity.x = options.player_shoot_speed * -1); //which side to fire on  
          this.soundShoot.volume = 0.25;
          this.soundShoot.play();
          this.shootTimer = this.game.time.now + options.player_shoot_timeout;
        }
        catch(error) {
          console.log('Bullet group depleted..');
        }
      }
  }

  

  update () {
    
    if(this.body.onFloor()) this.jumping = false;

    this.body.velocity.x = this.currentVelocity;

    if(this.controlsEnabled) {
      /* =========================== RIGHT ===============================*/
      if ( this.cursors.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ) {
         
         this.body.velocity.x = options.player_walk_speed;

         if (this.facing != 'right') {
             this.animations.play('right');
             this.facing = 'right';
         }
      }
      /* =========================== LEFT ===============================*/
      else if ( this.cursors.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ) {
         
         this.body.velocity.x = options.player_walk_speed * -1;

         if (this.facing != 'left') {
             this.animations.play('left');
             this.facing = 'left';
         }
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
      if ( (jumpButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_A))) {
        this.jump();
      }

      /* SHOOT */
      if( (shootButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_B))) {  
        this.shoot();
      }
      /* DASH */
      if( (dashButton.isDown || pad1.justPressed(Phaser.Gamepad.XBOX360_X))) {  
        this.dash();
      }
      if(pad1.justPressed(Phaser.Gamepad.XBOX360_START)){
        this.game.paused = !this.game.paused;
      }


    }//controls

    }

  

}
