const keys = {};
const levels = ['level1', 'todo'];
const animateTileInterval = 500;
const idleAnimationInteral = 8000; // How long in MS to wait before playing an alternative idle animation.
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

  // Play random alternative idle animation after some time passed w/o input.
  if (this.time.now > this.lastPlayerInput + idleAnimationInteral) {
    const anim = Math.random() > 0.5 ? 'idleAltA' : 'idleAltB';
    plr.anims.play(anim);
    this.lastPlayerInput = this.time.now; // Reset timer.
  }

  if (this.keys.up.isDown || this.keys.left.isDown || this.keys.right.isDown) {
    this.lastPlayerInput = this.time.now;
  }

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

  const anim = plr.anims.currentAnim.key;
  const oneArrowKeyIsDownButNotBoth = (this.keys.left.isDown || this.keys.right.isDown)
    && !(this.keys.left.isDown && this.keys.right.isDown);

  if (oneArrowKeyIsDownButNotBoth) {
    if (anim !== 'run' && !plr.jumping && !plr.hurt) {
      plr.anims.play('run');
    }

    if (this.keys.left.isDown) {
      plr.flipX = false;
      plr.body.velocity.x -= 20;
    }
    if (this.keys.right.isDown) {
      plr.flipX = true;
      plr.body.velocity.x += 20;
    }
  } else {
    if (anim !== 'idle' && anim !== 'idleAltA' && anim !== 'idleAltB' && !plr.jumping && !plr.hurt) {
      plr.anims.play('idle');
    }
  }

  if (plr.jumping && anim !== 'jump' && !plr.hurt) {
    plr.anims.play('jump');
  }

  if (plr.hurt && anim !== 'hurt') {
    plr.anims.play('hurt');
    if (plr.hurt === 'left') {
      plr.body.velocity.x = 100;
    } else {
      plr.body.velocity.x = -100;
    }
  }

  const maxSpeed = 100;
  if (Math.abs(plr.body.velocity.x) > maxSpeed) {
    plr.body.velocity.x = Math.sign(plr.body.velocity.x) * maxSpeed;
  }

  // World Wrap.
  if (plr.body.x > game.config.width) {
    plr.x = 0;
  }
  if (plr.body.x < -16) {
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
  const plr = this.physics.add.sprite(x, y, 'plr')
    .anims.play('idle', true);
  game.plr = plr;

  this.physics.add.collider(game.map.worldLayer, plr, () => {
    plr.jumping = false;
  });

  plr.body.setSize(12, 22, 2, 1);

  this.keys = {
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
  };

  plr.on('animationcomplete', () => {
    const anim = plr.anims.currentAnim.key;
    if (anim === 'idleAltA' || anim === 'idleAltB') {
      plr.anims.play('idle');
    }
    if (anim === 'hurt') {
      plr.hurt = false;
    }
  }, this);
};

const preloadLevel = function(levelName) {
  this.load.tilemapTiledJSON(levelName, `map/${levelName}.json`);
  this.load.spritesheet('monochrome-caves', 'img/monochrome-caves.png', {frameWidth: 8, frameHeight: 8});
};

const createLevel = function(levelName) {
  this.lastTileSwap = this.time.now;
  this.lastPlayerInput = this.time.now;

  randomizeStars.call(this);

  game.map = this.make.tilemap({key: levelName});
  game.map.tileset = game.map.addTilesetImage('monochrome-caves');
  game.map.worldLayer = game.map.createDynamicLayer('World', game.map.tileset, 0, 0);
  game.map.worldLayer.setCollisionByProperty({collides: true});

  // Spawn player and enemies from positions placed in Tiled object layer.
  const objectLayer = game.map.objects.find(objectLayer => objectLayer.name === 'Objects');
  const spawnPoint = objectLayer.objects.find(obj => obj.type === 'player');
  setUpPlayer.call(this, spawnPoint.x, spawnPoint.y);

  const znakes = objectLayer.objects
    .filter(obj => obj.type === 'znake')
    .map(znake => addZnake.call(this, znake.x, znake.y));
};

// Add a znake!
const addZnake = function(x, y) {
  const znake = this.physics.add.sprite(x, y, 'znake')
    .anims.play('left', true);

  znake.body.setSize(14, 14, 1, 0.5);
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
      game.plr.body.velocity.y -= 100;
      znake.kill();
    } else if (game.plr.anims.currentAnim.key !== 'hurt') {
      if (game.plr.x > znake.x) {
        game.plr.hurt = 'left';
      } else {
        game.plr.hurt = 'right';
      }
    }
  });

  return znake;
};

// Create eye w/ idle animations for the title screen.
const addEye = function(x, y) {
  const eye = this.add.sprite(x, y, 'eye');

  this.time.addEvent({ delay: 8000, callback: () => {
    eye.anims.play('lookRight');

    this.time.addEvent({ delay: 1000, callback: () => {
      eye.anims.play('lookLeft');
    }});

    this.time.addEvent({ delay: 4000, callback() {
      eye.anims.play('blink');
    }});
  }, loop: true });
};

const scenes = {
  menu: {
    preload() {
      // Art
      this.load.image('bg', 'img/title-bg.gif');
      this.load.image('push-start', 'img/title-push-start.gif');

      this.load.spritesheet('eye',
        'img/title-eye-idle.gif',
        { frameWidth: 13, frameHeight: 13 }
     );

      this.load.spritesheet('plr',
        'img/dreamer.gif',
        { frameWidth: 20, frameHeight: 24}
      );

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
      const startText = this.add.image(124, 204, 'push-start');

      // Flash the menu text.
      this.time.addEvent({ delay: 500, callback() {
        startText.setTintFill(0x000000);
      }, loop: true });

      this.time.addEvent({ delay: 100, callback: () => {
        this.time.addEvent({ delay: 500, callback() {
          startText.clearTint();
        }, loop: true });
      }});

      this.anims.create({
        key: 'lookRight',
        frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 3 }),
        frameRate: 10,
      });

      this.anims.create({
        key: 'lookLeft',
        frames: [
          { key: 'eye', frame: 3},
          { key: 'eye', frame: 2},
          { key: 'eye', frame: 1},
          { key: 'eye', frame: 0},
        ],
        frameRate: 10,
      });

      this.anims.create({
        key: 'blink',
        frames: [
          { key: 'eye', frame: 6},
          { key: 'eye', frame: 7},
          { key: 'eye', frame: 8},
          { key: 'eye', frame: 9},
          { key: 'eye', frame: 8},
          { key: 'eye', frame: 7},
          { key: 'eye', frame: 6},
          { key: 'eye', frame: 0},
        ],
        frameRate: 10,
      });

      addEye.call(this, 63, 61);
      addEye.call(this, 88, 61);

      this.anims.create({
        key: 'idle',
        frames: [
          { key: 'plr', frame: 8},
          { key: 'plr', frame: 8},
          { key: 'plr', frame: 10},
          { key: 'plr', frame: 8},
        ],
        frameRate: 8,
        repeat: -1
      });

      this.anims.create({
        key: 'idleAltA',
        frames: this.anims.generateFrameNumbers('plr', { start: 16, end: 23 }),
        frameRate: 8,
      });

      this.anims.create({
        key: 'idleAltB',
        frames: this.anims.generateFrameNumbers('plr', { start: 24, end: 31 }),
        frameRate: 8,
      });

      this.anims.create({
        key: 'run',
        frames: [
          { key: 'plr', frame: 0},
          { key: 'plr', frame: 1},
          { key: 'plr', frame: 2},
          { key: 'plr', frame: 1},
        ],
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'jump',
        frames: [
          { key: 'plr', frame: 33},
          { key: 'plr', frame: 32},
        ],
        frameRate: 10,
      });

      this.anims.create({
        key: 'hurt',
        frames: [
          { key: 'plr', frame: 34},
          { key: 'plr', frame: 36},
        ],
        frameRate: 10,
      });

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
