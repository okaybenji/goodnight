const keys = {};
const levels = ['level1', 'todo'];
const animateTileInterval = 500;
let animateTileIndex = 0;

const startNextLevel = function() {
  this.scene.start(levels.shift());
};

const update = function() {
  if (this.time.now > this.lastTileSwap + animateTileInterval) {
    if (animateTileIndex === 0) {
      game.map.replaceByIndex(53, 59); // Bubbles.
      game.map.replaceByIndex(45, 58); // Water surface.
      animateTileIndex = 1;
    } else {
      animateTileIndex = 0;
      game.map.replaceByIndex(59, 53);
      game.map.replaceByIndex(58, 45);
    }

    this.lastTileSwap = this.time.now;
  }

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

const addStar = function(delay) {
  const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomPosition = () => ({
    x: randomIntBetween(0, game.config.width),
    y: randomIntBetween(0, game.config.height)
  });

  const pos = getRandomPosition();
  const star = this.add.sprite(pos.x, pos.y, 'star')

  // Stagger star animations.
  this.time.delayedCall(delay, () => {
    star.anims.play('twinkle', true);
  }, [], this);

  star.on('animationrepeat', () => {
    const newPos = getRandomPosition();
    star.x = newPos.x;
    star.y = newPos.y;
  });
};

const randomizeStars = function() {
  [...Array(4)]
    .forEach((x, i) => {
      addStar.call(this, i * 100);
    });
};

// Add the player and set up controls.
const setUpPlayer = function(x, y) {
  const plr = this.physics.add.sprite(x, y, 'plr');
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
  this.lastTileSwap = this.time.now;

  randomizeStars.call(this);

  game.map = this.make.tilemap({key: levelName});
  game.map.tileset = game.map.addTilesetImage('monochrome-caves');
  game.map.worldLayer = game.map.createDynamicLayer('World', game.map.tileset, 0, 0);
  game.map.worldLayer.setCollisionByProperty({collides: true});

  // TODO: Place znake and player spawn positions as objects in Tiled.
  setUpPlayer.call(this, 196, 188);
  addZnake.call(this, 16, 128);
  addZnake.call(this, 32, 192);
  addZnake.call(this, 88, 160);
  addZnake.call(this, 120, 188);
};

// Add a znake!
const addZnake = function(x, y) {
  const znake = this.physics.add.sprite(x, y, 'znake')
    .anims.play('left', true);

  znake.kill = () => {
    znake.body.checkCollision.down = false;
    this.tweens.add({
        targets: znake,
        rotation: Math.random() * Math.PI,
        ease: 'Power1',
        duration: 750,
        onComplete() {
          znake.destroy();
        }
    });
  };

  znake.on('animationcomplete', () => {
    const anim = znake.anims.currentAnim.key;
    if (anim === 'turnLeft') {
      znake.anims.play('left');
    } else if (anim === 'turnRight') {
      znake.anims.play('right');
    }
  }, this);

  // Make znake patrol.
  this.physics.add.collider(game.map.worldLayer, znake, (znake, tile) => {
    const anim = znake.anims.currentAnim.key;
    // If the next tile the znake will encounter is not collidable, turn around.
    let nextX;
    if (anim === 'left') {
      znake.x -= 0.1;
      nextX = tile.x - 1;
    } else if (anim === 'right') {
      znake.x += 0.1;
      nextX = tile.x + 2;
    }
    const nextTile = tile.tilemapLayer.getTileAt(nextX, tile.y);
    if (!nextTile || !nextTile.properties.collides) {
      if (anim === 'left' && znake.x <= tile.getRight()) {
        znake.anims.play('turnRight');
      } else if (anim === 'right') {
        znake.anims.play('turnLeft');
      }
    }
  });
  this.physics.add.collider(game.plr, znake, () => {
    const plrJumpedOnZnake = game.plr.body.touching.down && znake.body.touching.up;
    if (plrJumpedOnZnake) {
      znake.kill();
    } else {
      console.log('it killed you');
    }
  });

  return znake;
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
      this.load.spritesheet('znake',
        'img/znake.gif',
        { frameWidth: 20, frameHeight: 16 }
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

      this.anims.create({
        key: 'left',
        frames: [
          { key: 'znake', frame: 4 },
          { key: 'znake', frame: 5 },
          { key: 'znake', frame: 6 },
          { key: 'znake', frame: 5 },
        ],
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'right',
        frames: [
          { key: 'znake', frame: 8 },
          { key: 'znake', frame: 9 },
          { key: 'znake', frame: 10 },
          { key: 'znake', frame: 9 },
        ],
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'turnRight',
        frames: [
          { key: 'znake', frame: 0 },
          { key: 'znake', frame: 1 },
          { key: 'znake', frame: 2 },
          { key: 'znake', frame: 3 },
        ],
        frameRate: 10,
      });

      this.anims.create({
        key: 'turnLeft',
        frames: [
          { key: 'znake', frame: 3 },
          { key: 'znake', frame: 2 },
          { key: 'znake', frame: 1 },
          { key: 'znake', frame: 0 },
        ],
        frameRate: 10,
      });

      const starPositions = [[9, 45], [12, 67], [4, 105], [99, 43], [79, 75],
                             [92, 105], [100, 150], [99, 200], [264, 114]];
      starPositions.forEach(pos => {
        this.add.sprite(pos[0], pos[1], 'star')
          .anims.play('twinkle', true);
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
