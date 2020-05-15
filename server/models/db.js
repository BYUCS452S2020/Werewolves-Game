const sqlite3 = require('sqlite3').verbose();
// open the database
const path = require('path');
const dbPath = path.resolve(__dirname, 'werewolves.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
  setup
};
// create users table
async function setup() {
  let q1 = 'CREATE TABLE IF NOT EXISTS users (Username TEXT PRIMARY KEY, Password TEXT, Email TEXT);'
  await db.run(q1,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`users table created`);
    }
  });

  let q2 = 'CREATE TABLE IF NOT EXISTS players (Username INTEGER, Room_id INTEGER, Character_id TEXT);'
  await db.run(q2,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`players table created`);
    }
  });

  // create gameTypes table
  let q3 = 'CREATE TABLE IF NOT EXISTS gameTypes (Game_name TEXT PRIMARY KEY, Number_players INTEGER, Characters TEXT);'
  await db.run(q3,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`gameTypes table created`);
    }
  });

  // create gameRooms table
  let q4 = 'CREATE TABLE IF NOT EXISTS gameRooms (Room_id INTEGER PRIMARY KEY AUTOINCREMENT, Room_name INTEGER, Game_name TEXT);'
  await db.run(q4,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`gameRooms table created`);
    }
  });

  // create characters table
  let q5 = 'CREATE TABLE IF NOT EXISTS characters (Character_id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Side INTEGER NOT NULL, Ability TEXT NOT NULL, Detail TEXT NOT NULL);'
  await db.run(q5,function(err) {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters table created`);
    }
  });

  let insertSQL = 'INSERT or IGNORE INTO characters (Character_id, Name, Side, Ability, Detail) VALUES(1, \'villager\', 1 , \'NULL\',\'Find all the werewolves in the village\' ),(2, \'werewolf\', 0 , \'kill_during_night\', \'Hide among the good guys and kill all villagers or all good characters other than villagers\' ),(3, \'hunter\', 1 ,\'kill_upon_death\', \'Bring someone with him/her upon death\' ),(4, \'witch\', 1 ,\'poison_or_save\', \'Can save or poison one person, only can perform each ability once per game\' ),(5, \'seer\', 1 ,\'test_during_night\', \'Get to test one player either night, to see if he/she is on the good side or not\' ),(6, \'knight\', true, \'challenge\', \'Challenge someone during during the his/her speaking time. Challenge werewolf, werewolf die. Challenge someone else, the knight die.\');'
  await db.run(insertSQL, function(err) {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters created`);
    }
  });

  db.close();
}