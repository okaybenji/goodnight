# TO-DO
* Add freeze/pan transitions between screens a la Mega Man 2.
* Replace placeholder music & SFX.
* Design a lot more levels!
* Add gamepad controls.
* Create Electron app.
* Show how many flowers player collected at the end of the game.
* Make the player hold up to climb up the chain, and let them hold down to climb down it.
* Add a seperate button for jump, let the player push up or the jump button to jump/vault.
* Add 'chill' button which causes player to stop and smell the roses.
* Show how many seconds player chilled at the end of the game.
* Show how many znakes player murdered at the end of the game.
* Remove all the .DS_Store files from the repo.
* Should we require player to be touching chain to go to next level?

# KNOWN BUGS
* Float animation is way too fast.
* Error occurs when trying to play the same sound twice: `openmpt: openmpt_module_read_float_stereo: ERROR: module * not valid`
* It's possible to fall out of the game bounds when trying to get the flower in the pond.
* Sometimes when the player is floating in water, the jump key doesn't seem to respond.
