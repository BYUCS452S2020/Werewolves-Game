module.exports = app => {
    const characters = require("../controllers/character.controller.js");
    console.log("in the route");
    
    // Create a new Customer
    app.post("/characters", characters.create);
  
    // Retrieve all Customers
    app.get("/characters", characters.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/characters/:name", characters.findOne);
  
    // Update a Customer with customerId
    app.put("/characters/:name", characters.update);
  
    // Delete a Customer with customerId
    app.delete("/characters/:name", characters.delete);
  
    // Create a new Customer
    app.delete("/characters", characters.deleteAll);
  };
  