const sql = require("./db.js");

// constructor
const Character = function(character) {
  this.name = character.name;
  this.side = character.side;
  this.ability = character.ability;
  this.detail = character.detail;
};

Character.create = (newCharacter, result) => {
  sql.query("INSERT INTO characters SET ?", newCharacter, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created character: ", { ...newCharacter });
    result(null, { ...newCharacter });
  });
};

Character.findByName = (name, result) => {
  sql.query(`SELECT * FROM characters WHERE name = ${name}`, (err, res) => {
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
};

Character.getAll = result => {
  sql.query("SELECT * FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("characters: ", res);
    result(null, res);
  });
};

Character.updateByName = (name, character, result) => {
  sql.query(
    "UPDATE characters SET side = ?, ability = ?, detail = ? WHERE name = ?",
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
};

Character.remove = (name, result) => {
  sql.query("DELETE FROM characters WHERE name = ?", name, (err, res) => {
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

    console.log("deleted character with name: ", name);
    result(null, res);
  });
};

Character.removeAll = result => {
  sql.query("DELETE FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} characters`);
    result(null, res);
  });
};

module.exports = Character;
