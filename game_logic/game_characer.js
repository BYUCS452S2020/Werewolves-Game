class Character {
  constructor(name) {
	this.name = name;
    console.log("constructing character: " + name)
  }
	
	
	create_game(player_num){
		console.log("creating "+ player_num + " players")
	}
}

module.exports = Character;