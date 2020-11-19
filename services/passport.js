const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


// Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // verify the username and password,
  // call done with the user if it is the correct username and password
  // otherwise, call done with false

  User.findOne({ email: email }, function (err, user) {
    if(err) {
      return done(err);
    }

    if(!user) {
      return done(null, false);
    }

    // compare if the passwords - is 'password' equal to user.password

    user.comparePassword(password, function (err, isMatch) {
      if(err) {
        return done(err);
      }

      if(!isMatch) {
        return (null, false);
      }

      return done(null, user);
    })
  })
});


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
passport.use('JWT', jwtLogin);
passport.use('local', localLogin);
