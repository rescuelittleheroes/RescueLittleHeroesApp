const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const SlackStrategy = require("passport-slack").Strategy;
// const InstagramStrategy = require("passport-instagram").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
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
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
             User.findOne({
               githubId: profile.id
             })
               .then(user => {
                 if (user) {
                   return done(null, user);
                 }
                 const newUser = new User({
                   username: profile.displayName,
                   githubId: profile.id,
                   email: profile.email
                   
                 });
                 newUser.save().then(user => {
                   done(null, newUser);
                 });
               })
               .catch(error => {
                 done(error);
               });
    }
  )
);



passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/instagram/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        instagramId: profile.id
      })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          const newUser = new User({
            username: profile.displayName,
            instagramId: profile.id,
            email: profile.email
          });
          newUser.save().then(user => {
            done(null, newUser);
          });
        })
        .catch(error => {
          done(error);
        });
    }
  )
);





