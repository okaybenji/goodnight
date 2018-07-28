const scenes = {
  menu: {
    preload() {
      // Art
      this.load.image('bg', 'img/menu.png');
      this.load.spritesheet('star',
        'img/star.png',
        { frameWidth: 9, frameHeight: 9 }
      );

      // Scenes
      this.scene.add('play', scenes.play);
    },
    create() {
      const gfx = () => {
        this.add.image(160, 120, 'bg');

        this.anims.create({
          key: 'twinkle',
          frames: this.anims.generateFrameNumbers('star', { start: 0, end: 7 }),
          frameRate: 10,
          repeat: -1
        });

        const starPositions = [[45, 45], [48, 67], [40, 105], [135, 43], [115, 75],
                               [128, 105], [136, 150], [135, 200], [300, 114]];
        starPositions.forEach(pos => {
          this.add.sprite(pos[0], pos[1], 'star')
            .anims.play('twinkle', true);
          // TODO: How to offset animation by random number of frames?
        });
      };

      const input = () => {
        // Press any key to start.
        this.input.keyboard.on('keydown', event => {
          this.scene.start('play');
        });
      };

      gfx();
      input();
    },
  },
  play: {
    create() {
      const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

      [...Array(50)]
        // TODO: How to retrieve the width and height of the game?
        .map(x => [randomIntBetween(0, 320), randomIntBetween(0, 240)])
        .forEach(pos => {
          this.add.sprite(pos[0], pos[1], 'star')
            .anims.play('twinkle', true);
        });
    },
    update() {
    },
  },
};

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  zoom: 2.5,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: scenes.menu,
};

const game = new Phaser.Game(config);