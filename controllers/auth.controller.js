const User = require('../models/user.model');
const mongoose = require('mongoose');
const passport = require('passport');

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {

  function renderWithErrors(user, errors) {
      res.render('auth/login', {
          user: user,
          errors: errors
      });
  }

  const { email, password } =  req.body;
  if (!email || !password) {
      renderWithErrors(req.body, {
          email: email ? undefined : 'Email is required',
          password: password ? undefined : 'Password is required',
      });
  } else {
      passport.authenticate('local-auth', (error, user, validations) => {
          if (error) {
              next(error);
          } else if (!user) {
              renderWithErrors(req.body, validations);
          } else {
              req.login(user, (error) => {
                  if (error) {
                      next(error);
                  } else {
                      console.log('El siguiente usuario ha sido logeado :', user.email )
                      res.redirect('/profile');
                  }
              });
          }
      })(req, res, next);
  }
}


module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(user, errors) {
    res.render('auth/register', {
      user: user,
      errors: errors
    });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors(req.body, {
          email: 'Email is already registered'
        });
      } else {
        console.log(req.body.email);
        user = new User({
          email: req.body.email,
          password: req.body.password
        })
        console.log('user', user)
        return user.save()
          .then(user => {
            console.log({user});
            res.redirect('/login');
          });
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('auth/register', {
          user: req.body,
          errors: error.errors
        });
      } else {
        next(error);
      }
    });
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login')
}

module.exports.profile = (req, res, next) => {
  res.render('auth/profile');
}

