var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
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

    passport.use(new TwitterStrategy({
            consumerKey: 'o2ovfeFSAN4W0e7JsvID7PWBY',
            consumerSecret: 	'LMoPFoIkiLxWGO5mHG6H6ktELMlVYRGBnB5UCgQIS2N5TcLgaE',
            callbackURL: "http://localhost:8080/auth/twitter/callback",
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
        },
        function(token, tokenSecret, profile, done) {
            console.log(profile.emails[0].value);
            // Finds account in database that has and email the same.
            User.findOne({email: profile.emails[0].value}).select('username password email').exec(function (err, user) {
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

    passport.use(new GoogleStrategy({
            clientID: '644794077016-j9dednrpj0s0df9sdp1sj3usaac0mj2c.apps.googleusercontent.com',
            clientSecret: 'c8jjoOe5fau1PlUAcQgK5KtR',
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({email: profile.emails[0].value}).select('username password email').exec(function (err, user) {
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

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror' }), function(req, res) {
        // Forwards the user to a facebook view
        res.redirect('/facebook/' + token);
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/twittererror' }), function(req, res) {
        // Forwards the user to a twitter view
        res.redirect('/twitter/' + token);
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
        res.redirect('/google/' + token);
    });

    return passport;
};