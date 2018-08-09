const levels = ['level1', 'level2', 'level3'];
let flowers = 0; // Track how many flowers the player picks.

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const setLetter = (sprite, letter) => {
  const map = {
    ' ': 0, '!': 1, '“': 2, '”': 3, '@': 4, '&': 6, '\'': 7, ',': 12, '.': 14, ':': 26,
    a: 33, b: 34, c: 35, d: 36, e: 37, f: 38, g: 39, h: 40,
    i: 41, j: 42, k: 43, l: 44, m: 45, n: 46, o: 47, p: 48,
    q: 49, r: 50, s: 51, t: 52, u: 53, v: 54, w: 55, x: 56,
    y: 57, z: 58
  };

  sprite.setFrame(map[letter] || 0);
};

const intro = {
  paragraphs: [
    {
      text: `a young dreamer chills on their sofa, awaiting the start of their favorite cartoon.`,
      method(sprites) {
        this.anims.create({
          key: 'sparkle',
          frames: [
            { key: 'eyes', frame: 0},
            { key: 'eyes', frame: 1},
            { key: 'eyes', frame: 2},
            { key: 'eyes', frame: 1},
          ],
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'close',
          frames: this.anims.generateFrameNumbers('eyes', { start: 4, end: 7 }),
          frameRate: 5,
        });

        this.anims.create({
          key: 'slacken',
          frames: this.anims.generateFrameNumbers('mouth', { start: 0, end: 4 }),
          frameRate: 5,
        });

        this.anims.create({
          key: 'scan',
          frames: this.anims.generateFrameNumbers('tv-screen', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
        });

        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.anims.play('sparkle');

        // Set up parallax motion.
        sprites.sofa.target = 147;
        sprites.sofa.speed = 0.2;
        sprites.dreamer.target = 156;
        sprites.dreamer.speed = 0.4;
        sprites.eyes.target = 145;
        sprites.eyes.speed = 0.4;
        sprites.mouth.target = 143;
        sprites.mouth.speed = 0.4;
      }
    },
    {
      text: `every week the show's hero has a wonderful adventure in a strange new place,`,
      method(sprites) {
        sprites.eyes.visible = false;
        sprites.mouth.visible = false;
        sprites.dreamer.visible = false;
        sprites.sofa.visible = false;

        sprites.sofaBack.visible = true;
        sprites.tv.visible = true;
        sprites.tvScreen.visible = true;

        sprites.tvScreen.anims.play('scan');

        // Set up parallax motion.
        sprites.sofaBack.target = 92;
        sprites.sofaBack.speed = 0.4;
        sprites.tv.target = 161;
        sprites.tv.speed = 0.2;
        sprites.tvScreen.target = 154;
        sprites.tvScreen.speed = 0.2;
      }
    },
    {
      text: `using her wits to overcome some impossible obstacle.`,
      method(sprites) {
      }
    },
    {
      text: `but the time slot before is filled with stuffy old men saying things our dreamer can't understand,`,
      method(sprites) {
        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.visible = true;
        sprites.mouth.visible = true;
        sprites.dreamer.visible = true;
        sprites.sofa.visible = true;

        sprites.eyes.anims.play('sparkle');
      }
    },
    {
      text: `and soon they drift off into a strange world of their very own.`,
      method(sprites) {
        sprites.eyes.anims.play('close');
        sprites.mouth.anims.play('slacken');
      }
    },
    {
      text: `“but i mustn't sleep” our dreamer realizes!
      “my very favorite tv show will be starting any minute now!”`,
      method(sprites) {
      }
    },
    {
      text: `“i must escape this world somehow...
      ...and soon!!”`,
      method(sprites) {
      },
  }],
  onComplete() {
    startNextLevel.call(this);
  }
};

// !--- SPOILER ALERT ---!
const outro = {
  paragraphs: [
    {
      text: `our dreamer drowsily opens their eyes and tries to focus on the television screen.`,
      method(sprites) {
        this.anims.create({
          key: 'open',
          frames: [
            { key: 'eyes', frame: 7},
            { key: 'eyes', frame: 6},
            { key: 'eyes', frame: 5},
            { key: 'eyes', frame: 4},
          ],
          frameRate: 3,
        });

        this.anims.create({
          key: 'tighten',
          frames: [
            { key: 'mouth', frame: 4},
            { key: 'mouth', frame: 3},
            { key: 'mouth', frame: 2},
            { key: 'mouth', frame: 1},
          ],
          frameRate: 3,
        });

        this.anims.create({
          key: 'smile',
          frames: this.anims.generateFrameNumbers('mouth', { start: 0, end: 0 }),
        });

        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.anims.play('open');
        sprites.mouth.anims.play('tighten');
      },
    },
    {
      text: `the ending credits of the cartoon slowly come into focus.`,
      method(sprites) {
        sprites.eyes.visible = false;
        sprites.mouth.visible = false;
        sprites.dreamer.visible = false;
        sprites.sofa.visible = false;

        sprites.sofaBack.visible = true;
        sprites.tv.visible = true;
        sprites.tvScreen.visible = true;

        sprites.tvScreen.anims.play('scan');
      },
    },
    {
      text: `“i've missed it,” our dreamer sighs.
      but they can't help showing a small smile.`,
      method(sprites) {
        sprites.sofaBack.visible = false;
        sprites.tv.visible = false;
        sprites.tvScreen.visible = false;

        sprites.eyes.visible = true;
        sprites.mouth.visible = true;
        sprites.dreamer.visible = true;
        sprites.sofa.visible = true;
      },
      },
    {
      text: `they had an adventure all their own, filled with wonder enough to match those they had merely watched on tv.`,
      method(sprites) {
        sprites.mouth.anims.play('smile');
      },
    },
    {
      text: `anyhow, it's getting late now...
      might as well go back to sleep.`,
      method(sprites) {
        sprites.eyes.anims.play('close');
        sprites.mouth.anims.play('slacken');
      },
    }
  ],
  onComplete() {
    this.scene.start('credits');
  }
};

const cutsceneFactory = config => ({
  preload() {
    this.load.image('frame', 'img/frame.png');
    this.load.image('frame-bg', 'img/frame-bg.png');
    this.load.image('dreamer', 'img/cutscene-dreamer.gif');
    this.load.image('sofa', 'img/cutscene-sofa.gif');
    this.load.image('sofa-back', 'img/cutscene-sofa-back.gif');
    this.load.image('tv', 'img/cutscene-tv.gif');
    this.load.spritesheet('eyes', 'img/cutscene-dreamer-eyes.gif', {frameWidth: 41, frameHeight: 21});
    this.load.spritesheet('mouth', 'img/cutscene-dreamer-mouth.gif', {frameWidth: 14, frameHeight: 14});
    this.load.spritesheet('tv-screen', 'img/cutscene-tv-screen.gif', {frameWidth: 51, frameHeight: 34});
    this.load.spritesheet('typeface', 'img/typeface.gif', {frameWidth: 8, frameHeight: 8});
  },
  create() {
    this.add.image(128, 96, 'frame-bg');
    const sprites = {
      sofa: this.add.image(122, 106, 'sofa'),
      dreamer: this.add.image(106, 96, 'dreamer'),
      eyes: this.add.sprite(95, 96, 'eyes'),
      mouth: this.add.sprite(93, 113, 'mouth'),
      tv: this.add.image(131, 96, 'tv'),
      tvScreen: this.add.sprite(124, 91, 'tv-screen'),
      sofaBack: this.add.image(32, 103, 'sofa-back'),
    };
    this.add.image(128, 120, 'frame');

    // Configure sprites for parallax animations.
    this.sprites = sprites;

    const text = []; // For  clearing text.
    let timers = []; // For clearing or early invoking of text timers.

    const print = paragraph => {
      game.music.play('text');

      // Clear prior text/timers.
      text.forEach(sprite => {
        sprite.destroy();
      });
      timers.forEach((timer, i) => {
        timer.remove();
      });
      timers = [];

      const lineLength = 24;
      const top = 168;
      const left = 36;
      const timeBetweenChars = 50;
      let col = 0;
      let row = 0;
      let charCount = 0;

      paragraph.split(' ').forEach((word, i) => {
        word.split('').forEach((char, j) => {
          charCount++;

          const printChar = () => {
            if (char === '\n') {
              col = 0;
              row += 2;
              return;
            }

            // At start of each word, check if we should wrap.
            if (j === 0 && col + word.length > lineLength) {
              row += 1;
              col = 0;
            }

            const sprite = this.add.sprite(left + col * 8, top + row * 8, 'typeface')
            setLetter(sprite, char);
            col++;
            text.push(sprite)

            if (j + 1 === word.length) {
              const space = this.add.sprite(left + col * 8, top + row * 8, 'typeface')
              setLetter(space, ' ');
              col++;
              text.push(space);

              if (i + 1 === paragraph.split(' ').length) {
                timers = [];
                game.music.stop();
              }
            }
          };

          const timer = this.time.addEvent({
            delay: timeBetweenChars * charCount,
            callback: printChar
          });

          timers.push(timer);
        });
      });
    };

    const nextLine = () => {
      // If the text is still animating in, just display it all immediately.
      if (timers.length) {
        timers.forEach(timer => {
          if (!timer.hasDispatched) {
            timer.callback();
          }

          timer.remove();
        });

        timers = [];

        return;
      }

      const paragraph = config.paragraphs.shift();

      if (paragraph) {
        print(paragraph.text);
        paragraph.method.call(this, sprites);;
      } else {
        // Showed all the text.
        config.onComplete.call(this);
      }
    };

    // Press any key to start.
    this.input.keyboard.on('keydown', nextLine);

    // Print first line.
    nextLine();
  },
  update() {
    Object.values(this.sprites).forEach(sprite => {
      if (sprite.target && sprite.x < sprite.target) {
        sprite.x += sprite.speed;
      }
    });
  }
});

const startNextLevel = function() {
  this.scene.pause();

  // TODO: Create second scene above this one and pan to it a la Mega Man 2.

  const level = levels.shift();

  if (!level) {
    this.scene.start('outro');
    return;
  }

  if (level === 'level1') {
    game.music.play('forest');
  }
  this.scene.start(level);
};

let animateTileIndex = 0;
const update = function() {
  const idleAnimationInteral = 8000; // How long in MS to wait before playing an alternative idle animation.
  const animateTileInterval = 500;

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

  if (plr.isDead) {
    return;
  }

  // Play random alternative idle animation after some time passed w/o input.
  if (this.time.now > this.lastPlayerInput + idleAnimationInteral) {
    const anim = Math.random() > 0.5 ? 'idleAltA' : 'idleAltB';
    plr.anims.play(anim);
    this.lastPlayerInput = this.time.now; // Reset timer.
  }

  if (this.keys.up.isDown || this.keys.left.isDown || this.keys.right.isDown) {
    this.lastPlayerInput = this.time.now;
  }

  if (this.keys.up.isDown) {
    if (!plr.jumping) {
      plr.jump();
    }
  }
  if (plr.body.velocity.y < plr.maxJump) {
    plr.body.velocity.y = plr.maxJump;
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

  if (plr.jumping && !plr.hurt) {
    // Play platform climb-jump animation if player is bounding off the side of a platform.
    if (plr.body.blocked.left || plr.body.blocked.right) {
      if (anim !== 'climbJump') {
        plr.anims.play('climbJump');
      }
    } else {
      if (anim !== 'jump') {
        plr.anims.play('jump');
      }
    }
  }

  if (plr.hurt && anim !== 'hurt') {
    plr.anims.play('hurt');
    game.sfx.play('hurt');
    plr.kill();
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

  // Next Level!
  if (plr.body.y < 0) {
    game.sfx.play('victory');
    flowers += plr.flowers;
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

  this.physics.add.collider(game.map.worldLayer, plr, (plr, tile) => {
    plr.jumping = false;

    // Collect flowers.
    const tileBehindPlayer = game.map.getTileAt(tile.x, tile.y - 1);
    if (tileBehindPlayer && tileBehindPlayer.properties.flower) {
      tileBehindPlayer.visible = false;
      tileBehindPlayer.properties.flower = false;
      game.sfx.play('bounce');
      plr.flowers++;
    }
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

  plr.kill = () => {
    plr.isDead = true;
    const scene = this.scene;
    plr.body.checkCollision.down = false;
    this.time.addEvent({ delay: 750, callback() {
      scene.restart();
    }});
    plr.rotation = Math.PI;
    game.sfx.play('die');
  };

  plr.maxJump = -200;
  plr.jump = throttle(() => {
    plr.jumping = true;
    plr.body.velocity.y += plr.maxJump;
    game.sfx.play('jump');
  }, 30);

  plr.flowers = 0;

  // Make player flash a few times on scene start.
  const flashTimer = this.time.addEvent({ delay: 100, callback() {
    plr.isTinted ? plr.clearTint() : plr.setTintFill(0xFFFFFF);
  }, loop: true });

  this.time.addEvent({ delay: 600, callback() {
    plr.clearTint();
    flashTimer.remove();
  }});
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

  // On maps with water at the edges, there are 2 extra water tiles on each side to prevent player
  // from falling out of the map on world wrap. Thus, here the map is offset by 2 tiles.
  game.map.worldLayer = game.map.createDynamicLayer('World', game.map.tileset, -16, 0);
  game.map.worldLayer.setCollisionByProperty({collides: true});

  // Spawn player and enemies from positions placed in Tiled object layer.
  const objectLayer = game.map.objects.find(objectLayer => objectLayer.name === 'Objects');
  const spawnPoint = objectLayer.objects.find(obj => obj.type === 'player');
  setUpPlayer.call(this, spawnPoint.x, spawnPoint.y);

  const znakes = objectLayer.objects
    .filter(obj => obj.type === 'znake')
    .map(znake => addZnake.call(this, znake.x, znake.y));
};

const addZnake = function(x, y) {
  const znake = this.physics.add.sprite(x, y, 'znake')
    .anims.play('left', true);

  znake.body.setSize(14, 14, 1, 0.5);
  znake.kill = () => {
    znake.body.checkCollision.down = false;
    this.time.addEvent({ delay: 750, callback() {
      znake.destroy();
    }});
    znake.rotation = Math.PI;
    game.sfx.play('bounce');
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

      this.load.spritesheet('star',
        'img/star.png',
        { frameWidth: 9, frameHeight: 9 }
      );

      this.load.spritesheet('znake',
        'img/znake.gif',
        { frameWidth: 20, frameHeight: 16 }
      );

      // Add the cutscenes as scenes..
      this.scene.add('intro', scenes.intro);
      this.scene.add('outro', scenes.outro);
      this.scene.add('credits', scenes.credits);

      // Add levels as scenes.
      levels.forEach(levelName => {
        this.scene.add(levelName, scenes[levelName]);
      });
    },
    create() {
      // Set up SFX.
      /**
       * Each time a unique sound filename is passed in, a new instance of chiptune.js will be created with that sound as a buffer.
       * If the play method is called on sound file passed in previously, its respective instance will play the existing buffer.
       * This ensures the file system is only hit once per sound, as needed.
       * It will also prevent sounds from 'stacking' -- the same sound played repeatedly will interrupt itself each time.
       */
      const sfx = (audioCtx) => {
        const soundbank = {};

        return {
          play(fileName) {
            if (soundbank[fileName]) {
              soundbank[fileName].play(soundbank[fileName].buffer);
            } else {
              soundbank[fileName] = new ChiptuneJsPlayer(new ChiptuneJsConfig(0, audioCtx));
              soundbank[fileName].load('./sfx/' + fileName + '.xm', (buffer) => {
                soundbank[fileName].buffer = buffer;
                soundbank[fileName].play(buffer);
              });
            }
          }
        };
      };

      const bgm = (audioCtx) => {
        const player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1, audioCtx));

        return {
          play(fileName) {
            if (fileName === 'None') {
              player.stop.call(player);
            } else {
              player.load('./music/' + fileName + '.xm', (buffer) => {
                player.play(buffer);
              });
            }
          },
          stop() {
            player.stop.call(player);
          }
        };
      };

      const audioCtx = new AudioContext();
      game.sfx = sfx(audioCtx);
      game.music = bgm(audioCtx);

      // Set up graphics.
      const bg = this.add.image(128, 120, 'bg');

      bg.alpha = 0;

      // Fade in the menu screen.
      this.time.addEvent({delay: 500, callback() {
        bg.alpha += 0.33;
      }, repeat: 2});

      this.time.addEvent({delay: 1500, callback: () => {
        bg.alpha = 1;

        const startText = this.add.image(128, 204, 'push-start');

        // Flash the menu text.
        this.time.addEvent({ delay: 500, callback() {
          startText.setTintFill(0x000000);
        }, loop: true });

        this.time.addEvent({ delay: 100, callback: () => {
          this.time.addEvent({ delay: 500, callback() {
            startText.clearTint();
          }, loop: true });
        }});

        // Create eye w/ idle animations.
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

        addEye.call(this, 67, 61);
        addEye.call(this, 92, 61);
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
        key: 'climbJump',
        frames: [
          { key: 'plr', frame: 33},
          { key: 'plr', frame: 34},
        ],
        frameRate: 20,
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
      this.input.keyboard.on('keydown', () => {
        this.scene.start('intro');
      });

      // TESTING: Skip to first level.
      // startNextLevel.call(this);
    },
  },
  intro: cutsceneFactory(intro),
  outro: cutsceneFactory(outro),
  credits: {
    preload() {
      this.load.spritesheet('typeface', 'img/typeface.gif', {frameWidth: 8, frameHeight: 8});
    },
    create() {
      randomizeStars.call(this);

      const top = 112;
      const timeBetweenCredits = 6000;
      let sprites = []; // To clear credits.

      const credits = [
        ['art & animation:', , 'adam bing', , '@exciteless'],
        ['design, code, sound & story:', , 'benji kay', , '@okaybenji'],
        ['monochrome caves tileset:', , 'adam saltsman', , '@adamatomic'],
        ['inspired by the art', 'of sam boucher', , '@monsieureureka'],
        [, 'goodnight']
      ];

      credits.forEach((credit, i) => {
        const timer = this.time.addEvent({
          delay: timeBetweenCredits * i,
          callback: () => {
            // Clear prior credit.
            sprites.forEach(sprite => sprite.destroy());
            sprites = [];

            // Fade in the new one.
            credit.forEach((line, row) => {
              const chars = line.split('');
              const left = (256 - ((chars.length - 1) * 8)) / 2; // Center text.
              chars.forEach((char, col) => {
                const sprite = this.add.sprite(left + col * 8, top + row * 8, 'typeface');
                sprite.alpha = 0;
                sprites.push(sprite);
                setLetter(sprite, char);

                this.time.addEvent({delay: 250, callback() {
                  sprite.alpha += 0.5;
                }, repeat: 2});

                if (i + 1 !== credits.length) {
                  // Fade out.
                  this.time.addEvent({delay: timeBetweenCredits - 250, callback() {
                    sprite.alpha -= 0.5;
                  }});
                }
              });
            });
          }
        });
      });
    }
  }
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
