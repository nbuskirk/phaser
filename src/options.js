import Phaser from 'phaser';

export default {
	version: 0.1,
	gameVolume: 0.05,
	musicEnabled: true,
	soundsEnabled: true,
	uiVisible: true,
	spriteScale: 4,
	controls: {
		jump: Phaser.Keyboard.SPACEBAR,
		shoot: Phaser.Keyboard.Z,
		sprint: Phaser.Keyboard.SHIFT
	},
	enemyTypes: [{
		name: 'skeleton',
		lives: 8,
		power: 3,
		walkSpeed: 30,
		jumpHeight: -600,
		jumpAgain: Math.round(Math.random()*5000),
		rehitDelay: 200,
		weapons: [{
			name: 'Bone',
			power: 1,
			lifespan: 1500,
			speed: 3000,
			gravity: {x:0, y:-1500}
		}]
	},{
		name: 'skull'
	}],
	playerOptions: {
		name: 'Simon',
		life: 16,
		equippedItem: 1,
		walkSpeed: 200,
		jumpHeight: -600, //velocity.y
		jumpAgain: 500, //timeout to jump again
		rehitDelay: 600, //timeout to be hit again (armor?)
		weapons: [{
			name: 'Whip',
			power: 1,
			lifespan: 250,
			type: 'whip',
			speed: 200, //refire time
			strength: 800, //velocity.x,
			gravity: {x:0,y:-1500}
		  },
		  {
			name: 'Holywater',
			power: 3,
			lifespan: 1000, 
			type: 'holywater',
			speed: 1500, //slow refire
			count: 3,
			scale: 3,
			strength: 300, //velocity.x
			gravity: {x:0,y:300},
			velocity: {x:200,y:-400}
		  },
		  {
			name: 'Cross',
			power: 5,
			lifespan: 4000, 
			type: 'holywater',
			speed: 200, //fast refire
			strength: 500,
			count: 3,
			scale: 3,
			gravity: {x:0,y:-1500},
			velocity: {x:0,y:0}
		 }]
	
	}

}