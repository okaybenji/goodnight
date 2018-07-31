const keys = {};
const levels = ['level1', 'todo'];

const startNextLevel = function() {
  this.scene.start(levels.shift());
};

const update = function() {
  const plr = game.plr;

  const maxJump = -200;
  if (this.keys.up.isDown) {
    if (!plr.jumping) {
      plr.jumping = true;
      plr.body.velocity.y += maxJump;
    }
  }
  if (plr.body.velocity.y < maxJump) {
    plr.body.velocity.y = maxJump;
  }

  if (this.keys.left.isDown) {
    plr.body.velocity.x -= 20;
  }
  if (this.keys.right.isDown) {
    plr.body.velocity.x += 20;
  }
  const maxSpeed = 100;
  if (Math.abs(plr.body.velocity.x) > maxSpeed) {
    plr.body.velocity.x = Math.sign(plr.body.velocity.x) * maxSpeed;
  }

  // World Wrap.
  if (plr.body.x > game.config.width) {
    plr.x = 0;
  }
  if (plr.body.x < -8) {
    plr.x = game.config.width;
  }
  // Prevent playing plummeting into the abyss if slowly wrapping Y.
  // TODO: Figure out a better way to do this.
  if (plr.body.y > 198) {
    plr.y = 198;
    plr.body.velocity.y = 0;
  }
  // Next Level!
  if (plr.body.y < 0) {
    startNextLevel.call(this);
  }

  // Friction.
  if (plr.body.velocity.x > 0) {
    plr.body.velocity.x -= 6;
    if (plr.body.velocity.x < 0) {
      plr.body.velocity.x = 0;
    }
  } else if (plr.body.velocity.x < 0) {
    plr.body.velocity.x += 6;
    if (plr.body.velocity.x > 0) {
      plr.body.velocity.x = 0;
    }
  }

  const overTile = game.map.worldLayer.tilemap.getTileAtWorldXY(plr.x, plr.y);
  if (overTile && overTile.properties.climbable) {
    plr.body.allowGravity = false;
    plr.jumping = false;
    if (!plr.climbing) {
      plr.climbing = true;
      plr.body.velocity.x = 0;
      plr.body.velocity.y = 0;
    }
  } else {
    plr.body.allowGravity = true;
    plr.climbing = false;
  }

  // Float in water. Allow jumping out.
  if (overTile && overTile.properties.water) {
    plr.body.velocity.y = 0;
    plr.y -= 3;
    plr.jumping = false;
  }
};

const randomizeStars = function() {
  const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  [...Array(24)]
    .map(x => [randomIntBetween(0, game.config.width), randomIntBetween(0, game.config.height)])
    .forEach(pos => {
      this.add.sprite(pos[0], pos[1], 'star')
        .anims.play('twinkle', true);
    });
};

const setUpPlayer = function() {
  const plr = this.physics.add.sprite(196, 188, 'plr');
  game.plr = plr;
  this.physics.add.collider(game.map.worldLayer, plr, () => {
    plr.jumping = false;
  });

  this.keys = {
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
  };
};

const preloadLevel = function(levelName) {
  this.load.tilemapTiledJSON(levelName, `map/${levelName}.json`);
  this.load.spritesheet('monochrome-caves', 'img/monochrome-caves.png', {frameWidth: 8, frameHeight: 8});
};

const createLevel = function(levelName) {
  randomizeStars.call(this);

  game.map = this.make.tilemap({key: levelName});
  game.map.tileset = game.map.addTilesetImage('monochrome-caves');
  // TODO: Use dynamic layer and animation water surface and bubble tiles.
  game.map.worldLayer = game.map.createStaticLayer('World', game.map.tileset, 0, 0);
  game.map.worldLayer.setCollisionByProperty({collides: true});
  setUpPlayer.call(this);
};

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

      // Add levels as scenes.
      levels.forEach(levelName => {
        this.scene.add(levelName, scenes[levelName]);
      });
    },
    create() {
      // Set up graphics.
      this.add.image(124, 120, 'bg');

      this.anims.create({
        key: 'twinkle',
        frames: this.anims.generateFrameNumbers('star', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });

      const starPositions = [[9, 45], [12, 67], [4, 105], [99, 43], [79, 75],
                             [92, 105], [100, 150], [99, 200], [264, 114]];
      starPositions.forEach(pos => {
        this.add.sprite(pos[0], pos[1], 'star')
          .anims.play('twinkle', true);
        // TODO: How to offset animation by random number of frames?
      });

      // Press any key to start.
      this.input.keyboard.on('keydown', event => {
        startNextLevel.call(this);
      });
    },
  },
};

levels.forEach(levelName => {
  scenes[levelName] = {
    preload() {
      preloadLevel.call(this, levelName)
    },
    create() {
      createLevel.call(this, levelName)
    },
    update
  };
});

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 240,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 }
    }
  },
  scene: scenes.menu,
};

const game = new Phaser.Game(config);
