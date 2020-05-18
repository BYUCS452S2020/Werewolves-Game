module.exports = app => {
    const users = require("../controllers/user.controller.js");
    
    app.post('/users/authenticate', users.login);
    app.post('/users/register', users.create);
    app.get('/users/', users.findAll);
    app.get('/users/:username', users.findOne);
    app.delete('/users/:username', users.delete);
};
  