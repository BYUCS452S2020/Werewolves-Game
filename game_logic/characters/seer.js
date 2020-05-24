const Character = require('./game_character.js')

class Seer extends Character{
	constructor(character_id = -1){
		super("Seer    ", character_id);
		this.side = false;
		this.alive = true;
	}
}
module.exports = Seer;