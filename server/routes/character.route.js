module.exports = app => {
    const characters = require("../controllers/character.controller.js");
    
    // Create a new Character
    app.post("/characters", characters.create);
  
    // Retrieve all Characters
    app.get("/characters", characters.findAll);
  
    // Retrieve a single Character with Character_name
    app.get("/characters/:name", characters.findOne);
  
    // Update a Character with Character_name
    app.put("/characters/:name", characters.update);
  
    // Delete a Character with Character_name
    app.delete("/characters/:name", characters.delete);
  
    // Create a new Character
    app.delete("/characters", characters.deleteAll);
  };
  