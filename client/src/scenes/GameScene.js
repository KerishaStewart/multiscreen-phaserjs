import Utils from '../utils/utils';
import io from 'socket.io-client';
let screenNumber = 0;
let activeScreen = false;
let spriteAdded = false;

export default class GameScene extends Phaser.Scene{
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    init(){}

    preload(){
        this.load.atlas('ninjacat', 'assets/animations/ninjacat-run.png', 'assets/animations/ninjacat-run.json');
        this.load.image('bg', 'assets/images/clouds.png');
        this.load.image('tiles', 'assets/tilemaps/fantasy-tiles.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('ground', 'assets/images/ground.png');
    }
    
    create(){
        let self = this;
        //  The background and floor
        this.bg = this.add.tileSprite(0, 16, 800, 600, 'bg').setOrigin(0);
        this.ground = this.add.tileSprite(0, 528, this.game.config.width, 72, "ground");
        this.ground.setOrigin(0);
        this.ground.setScrollFactor(0);
        //this.ground.y = 528;

        const runConfig = {
            key: 'run',
            frames: this.anims.generateFrameNames('ninjacat', {prefix: 'ninja-run_', start: 0, end: 11, zeroPad: 2}),
            framerate: 12,
            repeat: -1
        };

        this.anims.create(runConfig);


        // this.tweens.add({
        //     targets: this.ninjacatanim.anims,
        //     timeScale: { from: 0.5, to: 2 },
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     repeat: -1,
        //     repeatDelay: 1000,
        //     hold: 1000,
        //     duraton: 3000
        // });

        this.socket = io(Utils.GlobalSettings.serverAddr, {
            reconnection: false
        });

        this.socket.on('connect', function(){
            console.log("connected");
        });

        this.socket.on('screenNumber', function(screenNum){
            screenNumber = screenNum;
            console.log(`I am screen ${screenNumber}`);
            if(screenNumber === 2){
                // initiate starting sequence
                self.socket.emit('screen1start');
            }
        });

        this.socket.on('startsequence', function(){
            if(screenNumber === 1){
                //this.ninjacatanim = this.add.sprite(400, 445, 'ninjacat');
                self.startRunningSequnce();
            }
        });

        this.socket.on('startsequnce2', function(){
            if(screenNumber === 2){
                self.startRunningSequnce();
            }
        });

        this.startRunningSequnce = function(){
            activeScreen = true;
            if(!spriteAdded)
            {
                self.ninjacatanim = this.add.sprite(0, 445, 'ninjacat');
                self.ninjacatanim.setScale(0.4);
                self.ninjacatanim.play('run');

                spriteAdded = true;
            }
            else
            {
                self.ninjacatanim.x = 0;
            }
        }
    
        this.parallaxEffect = function(){
            // parallax effect
            self.bg.tilePositionX += 3 * this.ninjacatanim.anims.timeScale;
            self.ground.tilePositionX += 6 * this.ninjacatanim.anims.timeScale;
        }
    }

    update(){
        if(activeScreen && screenNumber === 1){
            this.parallaxEffect();
            // move across the screen
            this.ninjacatanim.x += 7;
            if(this.ninjacatanim.x >= this.game.config.width + 125){
                activeScreen = false;
                this.socket.emit('startscreen2sequence');
            }
        }
        else if(activeScreen && screenNumber === 2){
            this.parallaxEffect();
            this.ninjacatanim.x += 7;
            if(this.ninjacatanim.x >= this.game.config.width + 125){
                activeScreen = false;
                this.socket.emit('screen1start');
            }
        }
    }
}