//import GameManager from './game_manager.js';


var round = 0;
var gameover = false;

const GameManager = require('./game_manager.js')
let gameManager = new GameManager()


console.log('Welcome to the village!');

const readline = require('readline');
response = readline();

while(gameover == false){
	
	
	
	assign_character();
	
	console.log('Let\' go to sleep!');
	
	kill_character();
	
	console.log('');
	
	gameover = true
}

function assign_character(){
	console.log('assigning characters');
}


//to kill off a character
function kill_character(){
	console.log('Killing a character');
}


function debate(){
	console.log('debating among themsleves');
}

function vote(){
	console.log('voting to see who die');
}