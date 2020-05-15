const Character = require("../models/character.model.js");

// Create and Save a new Character
exports.create = (req, res) => {

  // Validate request
  if (!req.body) {
    console.log("no requestbody error");
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Character
  const character = new Character({
    name: req.body.name,
    side: req.body.side,
    ability: req.body.ability,
    detail: req.body.detail
  });

  // Save Character in the database
  Character.create(character, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Character."
      });
    else res.send(data);
  });
};

// Retrieve all Characters from the database.
exports.findAll = (req, res) => {
  Character.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving characters."
      });
    else res.send(data);
  });
};

// Find a single Character with a name
exports.findOne = (req, res) => {
  Character.findByName(req.params.name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Character with name ${req.params.name}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Character with name " + req.params.name
        });
      }
    } else res.send(data);
  });
};

// Update a Character identified by the name in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Character.updateByName(
    req.params.name,
    new Character(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Character with name ${req.params.name}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Character with name " + req.params.name
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Character with the specified name in the request
exports.delete = (req, res) => {
  Character.remove(req.params.name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Character with name ${req.params.name}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Character with name " + req.params.name
        });
      }
    } else res.send({ message: `Character was deleted successfully!` });
  });
};

// Delete all Characters from the database.
exports.deleteAll = (req, res) => {
  Character.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all characters."
      });
    else res.send({ message: `All Characters were deleted successfully!` });
  });
};
