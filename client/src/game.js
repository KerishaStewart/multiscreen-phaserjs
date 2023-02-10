import Phaser from 'phaser';
import GameScene from './scenes/GameScene';


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    // Sets game scaling
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene:[GameScene]
}

window.onload = function(){
    var game = new Phaser.Game(config);
}