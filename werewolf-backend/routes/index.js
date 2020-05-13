var express = require('express');
var router = express.Router();

var users = [];
var user = {
  username: '',
  password: ''
};

router.get('/', function(req, res, next) {
  console.log("in to index.js");
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  user.username = req.username;
  user.password = req.password;
  console.log(user);
  users.push(user);
});

router.get('/users/:username', function(req, res, next) {
  var username = req.param.username;
  
  res.send((username) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        return useres[i];
      }
    }
    return null;
  });
});



module.exports = router;
