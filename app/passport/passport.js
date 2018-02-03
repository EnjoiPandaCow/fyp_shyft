var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/user');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'thisisatestsecret';

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false }}));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '1542862105829893',
            clientSecret: 'c08d7079f0f2ad56f906b82cdbf39ced',
            callbackURL: "http://localhost:8080/auth/facebook/callback",
            // Specifies what we get back from facebook.
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function(accessToken, refreshToken, profile, done) {
            // Finds account in database that has and email the same.
            User.findOne({email: profile._json.email}).select('username password email').exec(function(err, user) {
                if (err) done(err);

                // If facebook email is not confirmed then this will create a null user. Protecting against that is a user & verified email.
                if (user && user !== null) {
                    done(null, user);
                } else {
                    done(err)
                }
            });
        }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror' }), function(req, res) {
        // Forwards the user to a facebook view
        res.redirect('/facebook/' + token)
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport;
};