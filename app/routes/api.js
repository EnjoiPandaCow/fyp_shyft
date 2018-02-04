var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var secret      = 'thisisatestsecret';

module.exports = function(router) {

    //Get all Users Route: Using it for testing currently.
    router.get('/users', function(req, res) {
        User.find(function(err, user) {
           if(err)
               res.status(404).send(err);
           else
               res.status(200).json(user);
        });

    });

    // User Registration Route - http://localhost:8080/api/users
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {

            res.status(200).json({success: false, message: 'Ensure username, email and password were provided.'});

        } else {
            user.save(function(err) {
                if(err){
                    res.status(200).json({ success: false, message: 'Username or Email already exists.'});
                } else {
                    res.status(201).json({ success: true, message: 'User Created.'});
                }
            });
        }
    });

   // User Login Route - http://localhost:8080/api/authenticate
    router.post('/authenticate', function(req, res) {
       User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
          if (err) throw err;

          if (!user) {
              res.status(400).json({ success: false, message: 'Could not authenticate user.'});
          } else if (user) {
                //Using comparePassword Method
              if (req.body.password) {
                  var validatePassword = user.comparePassword(req.body.password);
                  if (!validatePassword) {
                      res.status(400).json({success : false, message : 'Could not authenticate password!'});
                  } else{
                      // Assigning a token to the current user that lasts 24h.
                      var token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
                      res.status(200).json({success : true, message : 'User Authenticated!',  token: token});
                  }
              } else{
                  res.status(400).json({success : false, message : 'No password provided!'});
              }
          }
       });
    });

    router.use(function(req, res, next) {
       // Need to get the token that can be done from the request, the URL or the headers.
       var token = req.body.token || req.body.query || req.headers['x-access-token'];

       // If there is a token then verify token
       if (token) {

           jwt.verify(token, secret, function(err, decoded) {
               // Error means token was not verified - could happen if token expires
               if (err) {
                   res.json({success: false, message: 'Token invalid'});
               } else {
                   // Assign the token to a local variable that we can use and pass to the currentUser route.
                   req.decoded = decoded;
                   // Lets the application continue onto the /currentUser route.
                   next();
               }
           });
       } else {
           res.json({ sucess: false, message: 'No token provided.'});
       }
    });

    // Need a way to get the token decrypted and send it back to the user. To do that we create a middleware which is th router.use function above.
    router.post('/currentUser', function(req, res) {
       res.send(req.decoded);
    });

    return router;
};






