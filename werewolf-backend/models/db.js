var mysql = require('mysql');

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "h7o1w5ieSQL",
  database: "werewolf"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = con;

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");

  // // CREATE TABLE
  // var sql = "CREATE TABLE characters (name VARCHAR(255) PRIMARY KEY, side BOOLEAN, ability VARCHAR(255), detail VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });

  // // DELETE TABLE
  // var sql = "DROP TABLE characters";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table deleted");
  // });

  // // INSERT CHARACTORS
  // var werewolfSql = "INSERT INTO characters (name, side, ability, detail) VALUES ('werewolf', false, 'werewolf', 'hide among the good guys and kill all villagers or all good characters other than villager')";
  // var villagerSql = "INSERT INTO characters (name, side, ability, detail) VALUES ('villager', true, NULL, 'find all the werewolf in the village')";
  // var seerSql     = "INSERT INTO characters (name, side, ability, detail) VALUES ('seer', true, 'seer', 'get to test one player either night, to see if he/she is on the good side or not')";
  // var witchSql    = "INSERT INTO characters (name, side, ability, detail) VALUES ('witch', true, 'witch', 'can save and poison one person, only do each once per game')";
  // var knightSql   = "INSERT INTO characters (name, side, ability, detail) VALUES ('knight', true, 'knight', 'challenge someone during his/her speaking time. challenge werewolf, werewolf die. challenge someone not a werewolf, the knight die.')";
  // var hunterSql   = "INSERT INTO characters (name, side, ability, detail) VALUES ('hunter', true, 'hunter', 'bring someone with him/her upon death.')";
  // con.query(werewolfSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("werewolf record inserted");
  // });
  // con.query(villagerSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("villager record inserted");
  // });
  // con.query(seerSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("seer record inserted");
  // });
  // con.query(witchSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("witch record inserted");
  // });
  // con.query(knightSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("knight record inserted");
  // });
  // con.query(hunterSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("hunter record inserted");
  // });

  // // DELETE CHARACTER
  // var dwerewolfSql = "DELETE FROM characters WHERE name = 'werewolf'";
  // var dvillagerSql = "DELETE FROM characters WHERE name = 'villager'";
  // var dseerSql     = "DELETE FROM characters WHERE name = 'seer'";
  // var dwitchSql    = "DELETE FROM characters WHERE name = 'witch'";
  // var dknightSql   = "DELETE FROM characters WHERE name = 'knight'";
  // var dhunterSql   = "DELETE FROM characters WHERE name = 'hunter'";
  // con.query(dwerewolfSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dwerewolf of records deleted: " + result.affectedRows);
  // });
  // con.query(dvillagerSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dvillager of records deleted: " + result.affectedRows);
  // });
  // con.query(dseerSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dseer of records deleted: " + result.affectedRows);
  // });
  // con.query(dwitchSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dwitch of records deleted: " + result.affectedRows);
  // });
  // con.query(dknightSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dknight of records deleted: " + result.affectedRows);
  // });
  // con.query(dhunterSql, function (err, result) {
  //   if (err) throw err;
  //   console.log("dhunter of records deleted: " + result.affectedRows);
  // });
// });
