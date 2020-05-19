const Character = require('./game_character.js')

class Werewolf extends Character{
	constructor(character_id = -1){
		super("Werewolf", character_id);
		this.side = false;
		this.alive = true;
	}
}
module.exports = Werewolf;