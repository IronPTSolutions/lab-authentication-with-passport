const createError = require('http-errors');
const User = require('../models/user.model');

module.exports.profile = (req, res, next) => {
  res.render('users/profile');
}

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/list', {
        users: users
      });
    })
    .catch(error => next(error));
}

module.exports.delete = (req, res, next) => {

  const userId = req.params.id;

  User.findByIdAndDelete({_id: userId})
    .then((user) => {
      (user.id === req.user.id) ? res.redirect('/logout') : res.redirect('/users');
    })
    .catch(error => next(error));
}