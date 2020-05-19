<<<<<<< HEAD
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
        // .then(users => res.json(users))
        .then(res => res.text())   
        .then(text => console.log(text))
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
=======
module.exports = app => {
    const users = require("../controllers/user.controller.js");
>>>>>>> df534ff9b06cdfc813d1e4607e6a27cedb58e441
    
    app.post('/users/authenticate', users.authenticate);
    app.post('/users/register', users.create);
    app.get('/users/', users.findAll);
    app.get('/users/:username', users.findOne);
    app.delete('/users/:username', users.delete);
};
  