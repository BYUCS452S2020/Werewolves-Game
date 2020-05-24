const Character = require('./game_character.js')

class Hunter extends Character{
	constructor(character_id = -1){
		super("Hunter  ", character_id);
		this.side = false;
		this.alive = true;
	}
}
module.exports = Hunter;