const Werewolf = require('./characters/werewolf.js')
const Villager = require('./characters/villager.js')
const Hunter = require('./characters/hunter.js')
const Seer = require('./characters/seer.js')
const Witch = require('./characters/witch.js')
const Knight = require('./characters/knight.js')

class GameManager {


	
	constructor() {
    	console.log('constructing gameManager');
		this.playerNums = 6;
		this.villagers = 2;
		this.specialCharacters = 2;
		this.werewolves = 2;
		this.characterArray = [];
		this.dict = ['dummy'];
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
		else if(mode == 1){
			this.villagers = num + 1;
			this.specialCharacters = num;
			this.werewolves = num;
		}
		else if(mode == 2){
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
		//console.log(`constructing ${this.werewolves} werewolves`);
		for(let i = 0; i < this.werewolves; i++){
			let random = Math.random() * id | 0 + 1;
			let werewolf = new Werewolf(random);
			this.dict.splice(random, 0, werewolf);
			id++;
		}
		for(let i = 0; i < this.villagers; i++){
			let random = Math.random() * id | 0 + 1;
			//console.log(random)
			let villager = new Villager(random);
			this.dict.splice(random, 0, villager);

			//this.dict[id] = villager;
			id++;
		}
		
		//['Hunter','Seer','Witch','Knight'];
		for(let i = 0; i < this.specialCharacters; i++){
			let random_index = Math.random() * id | 0 + 1;
			let rand_char = Math.random() * 4 | 0;
			let special_character;
			switch(rand_char) {
				case 0:
					special_character = new Hunter();
					break;
				case 1:
					special_character = new Seer();
				break;
					
				case 2:
					special_character = new Witch();
				break;
				
				case 3:
					special_character = new Knight();
				break;

				default:
			}
			
			
			this.dict.splice(random_index, 0, special_character);
			id++;
		}
		
	}
	
	// poison is the boolean to indicate whether the character is being
	// poisioned to death. Hunter won't be able to unleash its ability
	// if poisoned to death 
	// return true if killed a hunter
	kill_character(player_id, poison = false){
		this.dict[player_id].alive = false;
		// if(!false && this.dict[player_id_id].character_id == 3){ //hunter
		// return true;
			
		// }
		// return false;
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