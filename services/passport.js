const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // see of the user id in the payload exists in our database
  // if it exists, call done with that other
  // otherwise, call done without a user object

  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell Passport use this strategy
passport.use('email', jwtLogin);
