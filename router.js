const Authentication = require('./controllers/authentication');
// we need passport service for passport strategies to be available
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('JWT', { session: false });
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function (req, res) {
    res.send('hi there');
  });
  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
