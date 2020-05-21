const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../server/controllers/user.controller');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/public/werewolfLogo.png',
            '/public/wolficon.ico',
            '/werewolf.jpg',
            '/public/werewolf.jpg',
            '/characters'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.findOne(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};