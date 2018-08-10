# TO-DO
* Add freeze/pan transitions between screens a la Mega Man 2.
* Replace placeholder music & SFX.
* Design a lot more levels!
* Add gamepad controls.
* Create Electron app.
* Show how many flowers player collected at the end of the game.
* Try making it so you have to press a button every time you want to vault instead of just holding down jump button.
* Make the player hold up to climb up the chain, and let them hold down to climb down it.
* Rename "jump-climb" to "vault" in the code.
* Add a seperate button for jump, let the player push up or the jump button to jump/vault.
* Add 'chill' button which causes player to stop and smell the roses.
* Show how many seconds player chilled at the end of the game.
* Show how many znakes player murdered at the end of the game.
* Remove all the .DS_Store files from the repo.

# KNOWN BUGS
* Float animation is way too fast.
* Error occurs when trying to play the same sound twice: `openmpt: openmpt_module_read_float_stereo: ERROR: module * not valid`
* It's possible to 'climb' on the bottom of platforms (need to disable jump when player.body.blocked.up).
* It's possible to fall out of the game bounds when trying to get the flower in the pond.
