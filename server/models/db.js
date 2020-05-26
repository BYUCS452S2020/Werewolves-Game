const sqlite3 = require('sqlite3').verbose();
// open the database
const path = require('path');
const dbPath = path.resolve(__dirname, 'werewolves.db');
const db = new sqlite3.Database(dbPath);
const bcrypt = require('bcryptjs');

module.exports = {
  setup
};
// create users table
async function setup() {
  let q1 = 'CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, email TEXT);'
  await db.run(q1,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`users table created`);
    }
  });

  let q2 = 'CREATE TABLE IF NOT EXISTS players (username TEXT, room_id TEXT, character_id TEXT);'
  await db.run(q2,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`players table created`);
    }
  });

  // create gamerooms table
  let q4 = 'CREATE TABLE IF NOT EXISTS gamerooms (room_id INTEGER PRIMARY KEY AUTOINCREMENT, room_name TEXT);'
  await db.run(q4,function(err) {
    if (err) {
      return console.log(err.message);
    }
    else {
      //console.log(`gamerooms table created`);
    }
  });

  // create characters table
  let q5 = 'CREATE TABLE IF NOT EXISTS characters (character_id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Side INTEGER NOT NULL, Ability TEXT NOT NULL, Detail TEXT NOT NULL);'
  await db.run(q5,function(err) {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters table created`);
    }
  });

  let insertSQL = 'INSERT or IGNORE INTO characters (character_id, Name, Side, Ability, Detail) VALUES(1, \'villager\', 1 , \'NULL\',\'Find all the werewolves in the village\' ),(2, \'werewolf\', 0 , \'kill_during_night\', \'Hide among the good guys and kill all villagers or all good characters other than villagers\' ),(3, \'hunter\', 1 ,\'kill_upon_death\', \'Bring someone with him/her upon death\' ),(4, \'witch\', 1 ,\'poison_or_save\', \'Can save or poison one person, only can perform each ability once per game\' ),(5, \'seer\', 1 ,\'test_during_night\', \'Get to test one player either night, to see if he/she is on the good side or not\' ),(6, \'knight\', true, \'challenge\', \'Challenge someone during during the his/her speaking time. Challenge werewolf, werewolf die. Challenge someone else, the knight die.\');'
  await db.run(insertSQL, function(err) {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters created`);
    }
  });

  // hash password
  let password = bcrypt.hashSync("password", 10);
  

  await db.run("INSERT or IGNORE INTO users (username, password, email) VALUES (?,?,?)", "username", password, "email@email", (err, res) => {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters created`);
    }
  });

  await db.run("INSERT or IGNORE INTO gamerooms (room_id, room_name) VALUES (1, \'room1\'),(2, \'room2\'),(3, \'room3\')", (err, res) => {
    if (err) {
      return console.log("err: " + err);
    }
    else {
      //console.log(`characters created`);
    }
  });

  db.close();
  console.log("db setup");
}