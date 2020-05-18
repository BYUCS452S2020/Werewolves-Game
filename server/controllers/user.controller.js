const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Create and Save a new User
exports.create = (req, res) => {

  // Validate request
  if (!req.body) {
    console.log("no requestbody error");
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    else res.send(data);
  });
};

// Find a single User with a username
exports.findOne = (req, res) => {
  var authHeader = req.headers.authorization;
    if(!authHeader){
        var err = new Error("you could not be authorized");
        err.status = 401;
        next(err);
        return;
    }
  console.log('authHeader :'+authHeader);

  User.findByName(req.params.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with username ${req.params.username}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with username " + req.params.username
        });
      }
    } else res.send(data);
  });
};

// Find a single User with a username
exports.login = (req, res) => {
  console.log("req.body: ", req.body);
  User.findByName(req.body.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with username ${req.params.username}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with username " + req.params.username
        });
      }
    }
    else {
      console.log("data: ", data);
      if (bcrypt.compareSync(req.body.password, data.password)) {
          const token = jwt.sign({ sub: data.username }, config.secret);
          console.log(token);
          let result = {
            token: token,
            data: data
          }
          res.send(result);
          return;
      }
      res.status(401).send({
        message: "Wrong password with username " + req.params.username
      });
    }
  });
};

// Update a User identified by the username in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  User.updateByName(
    req.params.username,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with username ${req.params.username}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with username " + req.params.username
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a User with the specified username in the request
exports.delete = (req, res) => {
  User.remove(req.params.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with username ${req.params.username}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with username " + req.params.username
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};

