const GameRoom = function(gameroom) {
    this.name = gameroom.name;
    this.side = gameroom.side;
    this.ability = gameroom.ability;
    this.detail = gameroom.detail;
  };
  
  GameRoom.create = (newgameroom, result) => {
    const sql = new sqlite3.Database(dbPath);
    console.log(newgameroom);
    sql.run("INSERT or IGNORE INTO gamerooms (name, side, ability, detail) VALUES (?,?,?,?)", newgameroom.name, newgameroom.side, newgameroom.ability, newgameroom.detail, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created gameroom: ", { ...newgameroom });
      result(null, { ...newgameroom });
    });
    sql.close();
  };
  
  GameRoom.findByname = (name, result) => {
    const sql = new sqlite3.Database(dbPath);
    sql.run(`SELECT * FROM gamerooms WHERE name = \'${name}\'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found gameroom: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found gameroom with the name
      result({ kind: "not_found" }, null);
    });
    sql.close();
  };
  
  GameRoom.getAll = result => {
    const sql = new sqlite3.Database(dbPath);
    sql.all("SELECT * FROM gamerooms", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, {err: err});
        return;
      }
  
      console.log("gamerooms: ", res);
      result(null, { ...res});
    });
    sql.close();
  };
  
  GameRoom.updateByname = (name, gameroom, result) => {
    const sql = new sqlite3.Database(dbPath);
    sql.run(
      "UPDATE gamerooms SET side = ?, ability = ?, detail = ? WHERE name = ?",
      [gameroom.side, gameroom.ability, gameroom.detail, gameroom.name],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found gameroom with the name
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated gameroom: ", { name: name, ...gameroom });
        result(null, { name: name, ...gameroom });
      }
    );
    sql.close();
  };
  
  GameRoom.remove = (name, result) => {
    const sql = new sqlite3.Database(dbPath);
    sql.run("DELETE FROM gamerooms WHERE name = ?", name, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res == 0) {
        // not found gameroom with the name
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted gameroom with name: ", name);
      result(null, res);
    });
    sql.close();
  };
  
  GameRoom.removeAll = result => {
    const sql = new sqlite3.Database(dbPath);
    sql.run("DELETE FROM gamerooms", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res} gamerooms`);
      result(null, res);
    });
    sql.close();
  };
  
  module.exports = GameRoom;