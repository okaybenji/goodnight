const scenes = {
  menu: {
    preload() {
      // Art
      this.load.image('bg', 'img/menu.png');
      this.load.image('plr', 'img/plr.png');
      // TODO: Make stars of various sizes.
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
    preload() {
      this.load.tilemapTiledJSON('map', 'map/level1.json');
      this.load.spritesheet('monochrome-caves', 'img/monochrome-caves.png', {frameWidth: 8, frameHeight: 8});
    },
    create() {
      const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

      [...Array(24)]
        .map(x => [randomIntBetween(0, game.config.width), randomIntBetween(0, game.config.height)])
        .forEach(pos => {
          this.add.sprite(pos[0], pos[1], 'star')
            .anims.play('twinkle', true);
        });

      // TODO: Animate water (swap lines) and bubbles (move up and disappear, then replace).
      const map = this.make.tilemap({key: 'map'});
      const tiles = map.addTilesetImage('monochrome-caves');
      map.createStaticLayer('Decorate', tiles, 0, 0);
      map.createStaticLayer('Interact', tiles, 0, 0);
      const collisionLayer = map.createDynamicLayer('Collide', tiles, 0, 0);
      collisionLayer.setCollisionByExclusion([-1]);

      const plr = this.physics.add.sprite(196, 188, 'plr');
      game.plr = plr;
      plr.setBounce(0.2); // our player will bounce from items
      this.physics.add.collider(collisionLayer, plr, () => {
        plr.jumping = false;
      });

      this.input.keyboard.on('keydown', event => {
        const keyMap = {
          ArrowLeft: () => plr.body.velocity.x -= 20,
          ArrowRight: () => plr.body.velocity.x += 20,
          ArrowUp() {
            if (plr.jumping) {
              // return;
            }
            plr.jumping = true;
            plr.body.velocity.y -= 20;
          }
        };

        if (keyMap[event.key]) {
          keyMap[event.key]();
        }
      });
    },
    update() {
      const plr = game.plr;

      if (plr.body.y > 200) {
        plr.y = 200;
      }
      if (plr.body.x > game.config.width) {
        plr.x = -8;
      }
      if (plr.body.x < -8) {
        plr.x = game.config.width;
      }
    }
  },
};

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  zoom: 2,
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