const Character = require('./game_character.js')


class Villager extends Character{
	constructor(character_id = -1){
		super("Villager", character_id);
		this.side = true;
		this.alive = true;
	}
}

module.exports = Villager;