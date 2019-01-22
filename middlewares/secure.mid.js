module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports.isLoged = (req, res, next) => {
  if (req.isAuthenticated()){
    res.redirect('/users');
  } else {
    next();
  }
} 
