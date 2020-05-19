const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'werewolves.db');

// constructor
const User = function(user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
};

User.create = (newUser, result) => {
  const db = new sqlite3.Database(dbPath);
  db.run("INSERT or IGNORE INTO users (username, password, email) VALUES (?,?,?)", newUser.username, newUser.password, newUser.email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
  db.close();
};

User.findByName = (username, result) => {
  const db = new sqlite3.Database(dbPath);
  db.get("SELECT * FROM users WHERE username = ?", username, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res) {
      console.log("found user: ", res);
      result(null, { ...res});
      return;
    }
    
    // not found user with the username
    result({ kind: "not_found" }, null);
  });
  db.close();
};

User.getAll = result => {
  console.log("in getAll");
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, {err: err});
      return;
    }

    console.log("users: ", res);
    result(null, { ...res});
  });
  db.close();
};

User.updateByName = (name, user, result) => {
  console.log("in updateByName");
  const db = new sqlite3.Database(dbPath);
  db.run(
    "UPDATE users SET password = ?, email = ? WHERE username = ?",
    [user.password, user.email, user.username],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the username
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { username: username, ...user });
      result(null, { username: username, ...user });
    }
  );
  db.close();
};

User.remove = (username, result) => {
  console.log("in remove");
  const db = new sqlite3.Database(dbPath);
  db.run("DELETE FROM users WHERE username = ?", username, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res == 0) {
      // not found User with the username
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with username: ", username);
    result(null, res);
  });
  db.close();
};

User.removeAll = result => {
  console.log("in removeAll");
  const db = new sqlite3.Database(dbPath);
  db.run("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res} users`);
    result(null, res);
  });
  db.close();
};

module.exports = User;
