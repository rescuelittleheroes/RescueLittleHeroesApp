const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const SlackStrategy = require("passport-slack").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, 
  (username, password, done) => {
    User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        done(null, false, { message: 'Incorrect username' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, foundUser);
    })
    .catch(err => done(err));
  }
));

// passport.use(
//   new InstagramStrategy(
//     {
//       clientID: INSTAGRAM_CLIENT_ID,
//       clientSecret: INSTAGRAM_CLIENT_SECRET,
//       callbackURL: "http://127.0.0.1:3000/auth/login/instagram/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//       User.findOrCreate({ instagramId: profile.id }, function(err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      // optionally persist profile data
      done(null, profile);
    }
  )
);

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/login"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ instagramId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);




