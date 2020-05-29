const Character = require('./game_character.js')


class Witch extends Character{
	constructor(character_id = 5){
		super("Witch   ", character_id);
		this.side = true;
		this.alive = true;
	}
}

module.exports = Witch;