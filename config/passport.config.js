const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

module.exports.setup = (passport) => {

    /**
     * Write user id at the session cookie
     */
    passport.serializeUser((user, next) => 
        next(null, user.id)    
    );

    /**
     * Read user from the session cookie
     */
    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(user => next(null, user))
            .catch(error => next(error))
    });

    passport.use('local-auth', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, next) => {
        User.findOne({email: email})
            .then(user => {
                if (!user) {
                    next(null, null, {email: "invalid user or password"})
                } else {
                    return user.checkPassword(password)
                        .then(match => {
                            if (!match) {
                                next(null, null, {email: "invalid user or password"})
                            } else {
                                next(null, user);
                            }
                        })
                }
            })
            .catch(error => next(error));
    }))
}
