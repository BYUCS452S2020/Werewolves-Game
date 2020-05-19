require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const path = require('path');
const serveStatic = require('serve-static');
const db = require('./server/models/db');
const logger = require('morgan');

app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

// set up sqlite3 db
db.setup();

// use JWT auth to secure the api
app.use(jwt());

// api routes
require('./server/routes/character.route')(app);
require('./server/routes/user.route')(app);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
