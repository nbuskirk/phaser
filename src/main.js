import 'pixi'
import 'p2'

/* Game States */
import Phaser from 'phaser'
import BootState from './states/Boot'
import SplashState from './states/Splash'
import IntroState from './states/Intro'
import Intro2State from './states/Intro2'
import GameState from './states/Game'
import MenuState from './states/Menu'
import GameOverState from './states/GameOver'


class Game extends Phaser.Game {

  constructor () {
    //let width = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth
    //let height = document.documentElement.clientHeight > 480 ? 480 : document.documentElement.clientHeight

    super(640,360, Phaser.AUTO, 'content', null, false, false)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Intro', IntroState, false)
    this.state.add('Intro2',Intro2State,false)
    this.state.add('Menu', MenuState, false)
    this.state.add('Game', GameState, false)
    this.state.add('GameOver', GameOverState, false)

    this.state.start('Boot')
  }

}

new Game()
