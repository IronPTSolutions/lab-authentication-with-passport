const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

module.exports.setup = (passport) => {


    // En este paso el id del usuario pasa a formar parte del string que compone la cookie
    // Así el string de la cookie, tiene pues un id del usuario actual

  passport.serializeUser(function (user, next) {
    next(null, user.id);
  });

  
  passport.deserializeUser(function (id, next) {
    User.findById(id)
      .then(user => next(null, user))
      .catch(error => next(error));
  });


  passport.use('local-auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, next) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          next(null, null, { email: 'invalid user or password'})
        } else {
          return user.checkPassword(password)
            .then(match => {
              if (!match) {
                next(null, null, { email: 'invalid user or password' })
              } else {
                next(null, user);
              }
            })
        }
      })
      .catch(error => next(error));
  }));

}