var morgan      = require('morgan');
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var User        = require('./app/models/user');
var app         = express();
var port        = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost:27017/fyp_shyft', function(err) {
    if(err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.post('/users', function(req, res) {
    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;

    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {

        res.send('Ensure username, email and password were provided');

    } else {
        user.save(function(err) {
            if(err){
                res.send('Username or Email already exists.');
            } else {
                res.send('User Created.');
            }
        });
    }
});

//Process.env.PORT - If deploying to an environment that requires a certain port then it will use that one.
app.listen(port, function() {
    console.log('Running The Server on port ' + port)
});