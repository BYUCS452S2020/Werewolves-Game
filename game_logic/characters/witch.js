const Character = require('./game_character.js')


class Witch extends Character{
	constructor(character_id = -1){
		super("Witch   ", character_id);
		this.side = true;
		this.alive = true;
	}
}

module.exports = Witch;