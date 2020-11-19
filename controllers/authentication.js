const User = require('../models/user');


exports.signup = function (req, res, next) {
 // see if a user with a given email exists

  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  User.findOne({ email: email}, (err, existingUser) => {
    if(err) {
      return next(err);
    }

    // if a user with email exists, return an error

    if(existingUser) {
      return res.status(422).send({error: 'Email is in use'});
    }

    // if user with an email doesn't exist,
    // create a user record
    const user = new User({ email: email, password: password });
    user.save((err) => {
      if(err) {
        return next(err);
      }

      // respond to request indicating the user was created
      res.json({success: true});
    });
  });
};
