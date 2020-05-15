const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'werewolves.db');

// constructor
const Character = function(character) {
  this.name = character.name;
  this.side = character.side;
  this.ability = character.ability;
  this.detail = character.detail;
};

Character.create = (newCharacter, result) => {
  const sql = new sqlite3.Database(dbPath);
  console.log(newCharacter);
  sql.run("INSERT or IGNORE INTO characters (Name, Side, Ability, Detail) VALUES (?,?,?,?)", newCharacter.name, newCharacter.side, newCharacter.ability, newCharacter.detail, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created character: ", { ...newCharacter });
    result(null, { ...newCharacter });
  });
  sql.close();
};

Character.findByName = (name, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run(`SELECT * FROM characters WHERE Name = ${name}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found character: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Character with the name
    result({ kind: "not_found" }, null);
  });
  sql.close();
};

Character.getAll = result => {
  const sql = new sqlite3.Database(dbPath);
  sql.all("SELECT * FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, {err: err});
      return;
    }

    console.log("characters: ", res);
    result(null, { ...res});
  });
  sql.close();
};

Character.updateByName = (name, character, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run(
    "UPDATE characters SET Side = ?, Ability = ?, Detail = ? WHERE Name = ?",
    [character.side, character.ability, character.detail, character.name],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Character with the name
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated character: ", { name: name, ...character });
      result(null, { name: name, ...character });
    }
  );
  sql.close();
};

Character.remove = (name, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run("DELETE FROM characters WHERE Name = ?", name, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res == 0) {
      // not found Character with the name
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted character with name: ", name);
    result(null, res);
  });
  sql.close();
};

Character.removeAll = result => {
  const sql = new sqlite3.Database(dbPath);
  sql.run("DELETE FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res} characters`);
    result(null, res);
  });
  sql.close();
};

module.exports = Character;
