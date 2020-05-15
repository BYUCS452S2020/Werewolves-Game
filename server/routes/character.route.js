const express = require('express');
const router = express.Router();
const characters = require("../controllers/character.controller");

// routes
// Create a new Character
router.post("/", characters.create);

// Retrieve all Characters
router.get("/", characters.findAll);

// Retrieve a single Character with Character_name
router.get("/:name", characters.findOne);

// Update a Character with Character_name
router.put("/:name", characters.update);

// Delete a Character with Character_name
router.delete("/:name", characters.delete);

// Create a new Character
router.delete("/", characters.deleteAll);

module.exports = router;