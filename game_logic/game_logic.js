//import stdio from 'stdio';

let round = 0;  // used to store the current round of the game
let gameover = false;  // boolean value to indicate if the game is over

const GameManager = require('./game_manager.js')
let gameManager = new GameManager()

let cmd = require('node-stdio');


console.log('Welcome to the village!');

console.log('Please input the number of players(6)');

let playersNum = cmd.readInt();

gameManager.game_init(playersNum);
	
assign_character();


while(gameover == false){
	
	
	
	gameManager.show_characters();
	
	console.log('Let\'s go to sleep!');
	console.log('Werewolves please kill a player!');
	kill_character();
	
	console.log('Let\'s wake up!');
	
	gameover = check_for_game_over();
	
	if(gameover == false){
		console.log('Let\'s vote! ');
		vote();
		gameover = check_for_game_over();
		
	}

	
}

gameManager.show_characters();

console.log('Game Over!');

function assign_character(){
	console.log('assigning characters');
}


//to kill off a character
function kill_character(){
	console.log('Which player do you want to kill?');
	let id = cmd.readInt();
	gameManager.kill_character(id);
	console.log(`player ${id} is dead!!`);
}


function debate(){
	console.log('debating among themsleves');
}

function vote(){
	gameManager.votes_reset();
	let winners = [];
	console.log('Initiating the Voting Process: ');
	for(let i = 1; i <= gameManager.playerNums; i++){
		if(gameManager.dict[i].alive){
			console.log(`Voting for player ${i}`);
			let vote = cmd.readInt();
			gameManager.vote_for_character(i, vote);
			
		}
	}
	winners = gameManager.players_with_max_votes();
	while(winners.length > 1){
		gameManager.votes_reset();
		console.log(`The player\(s\) with the highest vote: ${winners}`);
		console.log('Looks like we need to vote again!');
		
		for(let i = 0 ; i < winners.length; i++){
			console.log(`Voting for player ${winners[i]}`);
			let vote = cmd.readInt();
			gameManager.vote_for_character(winners[i], vote);
		}
		winners = gameManager.players_with_max_votes();
	}
	
	
	console.log(`The player\(s\) with the highest vote: ${winners}`);
	gameManager.kill_character(winners[0]);
	console.log(`player ${winners[0]} is dead!!`);
	
	
}

function check_for_game_over(){
	return gameManager.game_over();
	
}