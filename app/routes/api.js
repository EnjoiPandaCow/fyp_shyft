var User        = require('../models/user');

module.exports = function(router) {

    // User Registration Route - http://localhost:8080/api/users
        router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {

            res.json({success: false, message: 'Ensure username, email and password were provided.'});

        } else {
            user.save(function(err) {
                if(err){
                    res.json({ success: false, message: 'Username or Email already exists.'});
                } else {
                    res.json({ success: true, message: 'User Created.'});
                }
            });
        }
    });


   // User Login Route - http://localhost:8080/api/authenticate
    router.post('/authenticate', function(req, res) {
       User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
          if (err) throw err;

          if (!user) {
              res.json({ success: false, message: 'Could not authenticate user.'});
          } else if (user) {
                //Using comparePassword Method
              if (req.body.password) {
                  var validatePassword = user.comparePassword(req.body.password);
                  if (!validatePassword) {
                      res.json({success : false, message : 'Could not authenticate password!'});
                  }
                  else{
                      res.json({success : true, message : 'User authenticated!'});
                  }
              }
              else{
                  res.json({success : false, message : 'Not password provided!'});
              }
          }
       });
    });
    return router;
};





