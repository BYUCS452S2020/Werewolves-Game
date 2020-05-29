const Character = require('./game_character.js')


class Knight extends Character{
	constructor(character_id = -1){
		super("Knight  ", character_id);
		this.side = true;
		this.alive = true;
	}
}

module.exports = Knight;