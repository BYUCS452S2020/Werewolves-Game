const express = require('express');
const router = express.Router();
const users = require("../controllers/user.controller.js");

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:username', getByName);
router.delete('/:username', _delete);

module.exports = router;

function authenticate(req, res, next) {
    users.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    users.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    users.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByName(req, res, next) {
  users.getByName(req.params.username)
      .then(user => user ? res.json(user) : res.sendStatus(404))
      .catch(err => next(err));
}

function _delete(req, res, next) {
    users.delete(req.params.username)
        .then(() => res.json({}))
        .catch(err => next(err));
}
// module.exports = app => {
//     const users = require("../controllers/user.controller.js");
    
//     // Create a new User
//     app.post("/users/register", users.register);
  
//     // Retrieve all Users
//     app.get("/users", users.findAll);

//     // Retrieve a single User with Username
//     app.get("/users/authenticate", users.login);
  
//     // Retrieve a single User with Username
//     app.get("/users/:username", users.findOne);
  
//     // Update a User with Username
//     app.put("/users/:username", users.update);
  
//     // Delete a User with Username
//     app.delete("/users/:username", users.delete);
  
//     // Create a new User
//     app.delete("/users", users.deleteAll);
//   };
  