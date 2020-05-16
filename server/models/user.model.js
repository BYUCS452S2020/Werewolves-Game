let sqlite3 = require('sqlite3').verbose();
let path = require('path');
let dbPath = path.resolve(__dirname, 'werewolves.db');

// constructor
const User = function(user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
};

User.create = async (newUser, result) => {
  console.log("in create");
  console.log(newUser);
  let db = new sqlite3.Database(dbPath);
  await db.run(`INSERT or IGNORE INTO users (username, password, email) VALUES ('${newUser.username}','${newUser.password}','${newUser.email}')` , (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
  console.log(result);
  console.log("end create");
  await db.close();
};

User.findByName = async (username, result) => {
  console.log("in findByName");
  let db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.get(`SELECT * FROM users WHERE username = "${username}"`, (err, res) => {
      console.log("in run findByName");
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log(res);
      if (res) {
        console.log("found user: ", res);
        result(null, res);
        return;
      }
      console.log("user not found");
      // not found user with the username
      result({ kind: "not_found" }, null);
    }).close();
  });
  console.log("end findByName");
  console.log(result);

};

User.getAll = async result => {
  console.log("in getAll");
  let db = new sqlite3.Database(dbPath);
  await db.all("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, {err: err});
      return;
    }

    console.log("users: ", res);
    result(null, { ...res});
  });
  await db.close();
};

User.updateByName = async (name, user, result) => {
  console.log("in updateByName");
  let db = new sqlite3.Database(dbPath);
  await db.run(
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
  await db.close();
};

User.remove = async (username, result) => {
  console.log("in remove");
  let db = new sqlite3.Database(dbPath);
  await db.run("DELETE FROM users WHERE username = ?", username, (err, res) => {
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
  await db.close();
};

User.removeAll = async result => {
  console.log("in removeAll");
  let db = new sqlite3.Database(dbPath);
  await db.run("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res} users`);
    result(null, res);
  });
  await db.close();
};

module.exports = User;
