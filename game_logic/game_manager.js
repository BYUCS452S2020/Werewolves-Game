const Werewolf = require('./characters/werewolf.js')
const Villager = require('./characters/villager.js')

class GameManager {


	
	constructor() {
    	console.log('constructing gameManager');
		this.playerNums = 6;
		this.villagers = 2;
		this.specialCharacters = 2;
		this.werewolves = 2;
		this.characterArray = [];
		this.dict = {};
  	}
	
	
	
	// this fuciton is supposed to access the game_type table.Or a new table to get the number of each
	// characters based on the total number of players
	// for example, 9 players would equal to 3 villagers, 3 werewolves, 3 special characters. Something like that
	game_init(player_nums = 6){
		console.log(`initizlazing ${player_nums} players` );
		this.playerNums = player_nums;
		var mode = player_nums % 3;
		var num = (player_nums / 3) | 0;
		
		if(mode == 0){
			this.villagers = num;
			this.specialCharacters = num;
			this.werewolves = num;
		}
		if(mode == 1){
			this.villagers = num + 1;
			this.specialCharacters = num;
			this.werewolves = num;
		}
		if(mode == 2){
			this.villagers = num;
			this.specialCharacters = num + 1;
			this.werewolves = num + 1;
		}
		this.characters_init();
	}
	
	// this funciton constructs the character objects based on the numbers that were retrieved by the game_init function
	characters_init(){
		console.log('initizlazing all the game characters');
		var id = 1;
		console.log(`constructing ${this.werewolves} werewolves`);
		for(var i = 0; i < this.werewolves; i++){
			let werewolf = new Werewolf(id);
			this.characterArray.push(werewolf);
			this.dict[id] = werewolf;
			id++;
		}
		console.log(`constructing ${this.villagers} villagers`);
		for(var i = 0; i < this.villagers; i++){
			let villager = new Villager(id);
			this.characterArray.push(villager);
			this.dict[id] = villager;
			id++;
		}
		console.log(`constructing ${this.specialCharacters} special characters`);
		for(var i = 0; i < this.specialCharacters; i++){
			let villager = new Villager(id);
			this.characterArray.push(villager);
			this.dict[id] = villager;
			id++;
		}
		
		
	}
	
	kill_character(character_id){
		this.dict[character_id].alive = false;
	}
	
	vote_for_character(character_id, votes){
		this.dict[character_id].vote = votes;
	}
	
	votes_reset(){
		for(var i = 1; i <= this.playerNums; i++){
			this.dict[i].vote = 0;
		}
	}
	
	players_with_max_votes(){
		let maxID = [];
		let maxVote = -1;
		for(var i = 1; i <= this.playerNums; i++){
			if(this.dict[i].vote > maxVote){
				maxVote = this.dict[i].vote;
				maxID = [];
				maxID.push(i);
			}
			else if (this.dict[i].vote == maxVote){
				maxID.push(i);
			}
			
			
		}
		return maxID;
		
	}
	
	show_characters(){
		console.log('--------------------------------------------------');
		for(var i = 1; i <= this.playerNums; i++){
			console.log(`   player: ${i}, character: ${this.dict[i].name}, Alive: ${this.dict[i].alive}`)
		}
		console.log('---------------------------------------------------');
	}
	
	game_over(){
		var goodGuys = false;
		var badGuys = false;
		for(var i = 1; i <= this.playerNums; i++){
			if(this.dict[i].alive && this.dict[i].side){
				goodGuys = true;
				
			}
			if(this.dict[i].alive && !this.dict[i].side){
				badGuys = true;
				
			}
		}
		
		if(goodGuys == false){
			console.log('No more villagers left, werewolves win!!');
			return true;
		}
		if(badGuys == false){
			console.log('No more werewolves left, the villagers win!!');
			return true;
		}
		
		return false;
	}
	
	
	

}

module.exports = GameManager;