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
  const sql = new sqlite3.Database(dbPath);
  console.log(newUser);
  sql.run("INSERT or IGNORE INTO users (Username, Password, Email) VALUES (?,?,?)", newUser.username, newUser.password, newUser.email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
  sql.close();
};

User.findByName = (username, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run(`SELECT * FROM users WHERE Username = ${username}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the username
    result({ kind: "not_found" }, null);
  });
  sql.close();
};

User.getAll = result => {
  const sql = new sqlite3.Database(dbPath);
  sql.all("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, {err: err});
      return;
    }

    console.log("users: ", res);
    result(null, { ...res});
  });
  sql.close();
};

User.updateByName = (name, user, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run(
    "UPDATE users SET Password = ?, Email = ? WHERE Username = ?",
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
  sql.close();
};

User.remove = (username, result) => {
  const sql = new sqlite3.Database(dbPath);
  sql.run("DELETE FROM users WHERE Username = ?", username, (err, res) => {
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
  sql.close();
};

User.removeAll = result => {
  const sql = new sqlite3.Database(dbPath);
  sql.run("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res} users`);
    result(null, res);
  });
  sql.close();
};

module.exports = User;
