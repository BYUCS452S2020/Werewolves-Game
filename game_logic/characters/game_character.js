class Character {


	constructor(name, character_id = -1) {
		this.name = name;
		console.log(`constructing character: ${name} with character id ${character_id}`);
		this.vote = 0;
		this.alive = false;
		this.side = true;
		//unique value for the character-player pair
		this.character_id = character_id;
	}
	
}

module.exports = Character;
