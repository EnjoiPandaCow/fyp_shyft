var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 8080;

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/fyp_shyft', function(err) {
    if(err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

//Process.env.PORT - If deploying to an environment that requires a certain port then it will use that one.
app.listen(port, function() {
    console.log('Running The Server on port ' + port)
});