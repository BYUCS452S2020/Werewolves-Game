//import stdio from 'stdio';

var round = 0;  // used to store the current round of the game
var gameover = false;  // boolean value to indicate if the game is over

const GameManager = require('./game_manager.js')
let gameManager = new GameManager()

// //in order to read line, good for debuggin on the console
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

console.log('Welcome to the village!');



// rl.question('How many players shall be instantiated? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });

async function askQ () {
	const answer = await ask('How many players shall be in the game?');
}

askQ();

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