const sqlite3 = require('sqlite3').verbose();
// open the database
const path = require('path');
const dbPath = path.resolve(__dirname, 'werewolves.db');
const db = new sqlite3.Database(dbPath);
// create users table
let q1 = 'CREATE TABLE IF NOT EXISTS users (user_name TEXT PRIMARY KEY,nickname TEXT,password TEXT,Room_id INTEGER, Character_name TEXT);'
db.run(q1,function(err) {
  if (err) {
    return console.log(err.message);
  }
  console.log(`user table created`);
});

// create gameTypes table
let q2 = 'CREATE TABLE IF NOT EXISTS gameTypes (game_name TEXT PRIMARY KEY,number_players INTEGER, characters TEXT);'
db.run(q2,function(err) {
  if (err) {
    return console.log(err.message);
  }
  console.log(`gameTypes table created`);
});

// create gameRooms table
let q3 = 'CREATE TABLE IF NOT EXISTS gameRooms (room_id INTEGER PRIMARY KEY,socket_number INTEGER, game_name TEXT);'
db.run(q3,function(err) {
  if (err) {
    return console.log(err.message);
  }
  console.log(`gameRooms table created`);
});

// create characters table
let q4 = 'CREATE TABLE IF NOT EXISTS characters (name TEXT PRIMARY KEY,side INTEGER NOT NULL, ability TEXT NOT NULL, detail TEXT NOT NULL);'
db.run(q4,function(err) {
  if (err) {
    return console.log("err: " + err);
  }
  console.log(`characters table created`);
});

let insertSQL = 'INSERT or IGNORE INTO characters (name, side, ability, detail) VALUES( \'villager\', 1 , \'NULL\',\'Find all the werewolves in the village\' ),( \'werewolf\', 0 , \'kill_during_night\', \'Hide among the good guys and kill all villagers or all good characters other than villagers\' ),( \'hunter\', 1 ,\'kill_upon_death\', \'Bring someone with him/her upon death\' ),( \'witch\', 1 ,\'poison_or_save\', \'Can save or poison one person, only can perform each ability once per game\' ),( \'seer\', 1 ,\'test_during_night\', \'Get to test one player either night, to see if he/she is on the good side or not\' ),(\'knight\', true, \'challenge\', \'Challenge someone during during the his/her speaking time. Challenge werewolf, werewolf die. Challenge someone else, the knight die.\');'

db.run(insertSQL, function(err) {
  if (err) {
    return console.log("err: " + err);
  }
  console.log(`characters created`);
});


db.close();
