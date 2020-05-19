//import stdio from 'stdio';

var round = 0;  // used to store the current round of the game
var gameover = false;  // boolean value to indicate if the game is over

const GameManager = require('./game_manager.js')
let gameManager = new GameManager()

var cmd = require('node-stdio');


console.log('Welcome to the village!');

console.log('Please input the number of players(6)');

var playersNum = cmd.readInt();

gameManager.game_init(playersNum);
	
assign_character();

while(gameover == false){
	
	
	
	gameManager.show_characters();
	
	console.log('Let\' go to sleep!');
	
	
	
	kill_character();
	
	
	gameover = check_for_game_over();
}

gameManager.show_characters();

function assign_character(){
	console.log('assigning characters');
}


//to kill off a character
function kill_character(){
	console.log('Which character do you want to kill?');
	let characterID = cmd.readInt();
	gameManager.kill_character(characterID);
	console.log(`Killing character ${characterID}`);
}


function debate(){
	console.log('debating among themsleves');
}

function vote(){
	console.log('voting to see who die');
}

function check_for_game_over(){
	return gameManager.game_over();
	
}