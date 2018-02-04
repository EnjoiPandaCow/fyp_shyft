var chai =      require('chai');
var chaiHttp =  require('chai-http');
var mongoose =  require('mongoose');
var _ =         require('lodash');
var server =    require('../../server');
var User =      require('../../app/models/user');
var expect =    chai.expect;

chai.use(chaiHttp);
chai.use(require('chai-things'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/fyp_shyft', {useMongoClient: true});
mongoose.Promise = require('bluebird');
var db = mongoose.connection;


db.on('error', function(err){
});

db.once('open', function(){
});

describe('User Route Test', function () {
    beforeEach(function (done) {

        User.remove({}, function (err) {
            if (err)
                done (err);
            else {
                var testUser1 = new User();

                testUser1._id = "59f6f0b99bd9dc7f544d7dac";
                testUser1.email = "testuser1@gmail.com";
                testUser1.password = "testPassword1";
                testUser1.username = "testUser1";

                testUser1.save(function (err) {
                    if (err)
                        console.log(err);
                    else {
                        var testUser2 = new User();

                        testUser2._id = "59f6f0b99bd9dc7f544d7dab";
                        testUser2.email = "testuser2@gmail.com";
                        testUser2.password = "testPassword2";
                        testUser2.username = "testUser2";

                        testUser2.save(function (err){
                            if (err)
                                console.log(err);
                            else {
                                done();
                            }
                        });
                    }
                });
            }
        });
    });
    describe('GET /users', function () {
       it ('should return all the users in the array', function (done) {
           chai.request(server)
               .get('/api/users')
               .end(function (err, res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.a('array');
                  expect(res.body.length).to.equal(2);
                   var result = _.map(res.body, function(user){
                       return {
                           email : user.email,
                           username : user.username
                       };
                   });
                   expect(result[0]).to.include({
                      email : "testuser1@gmail.com",
                      username : "testuser1"
                   });
                   expect(result[1]).to.include({
                       email : "testuser2@gmail.com",
                       username : "testuser2"
                   });
                  done();
               });
       });
   });
    describe('POST /users', function () {
        it('should return a confirmation message and an updated datastore', function (done) {
            var newUser = {
                "username": "testuser3",
                "password": "testPassword3",
                "email": "testuser3@gmail.com"
            };
            chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message').equal('User Created.');
                    chai.request(server)
                        .get('/api/users')
                        .end(function(err, res) {
                           var result = _.map(res.body, function(user) {
                               return {
                                   email : user.email,
                                   username : user.username
                               };
                           });
                           expect(result).to.include({
                               "email" : "testuser3@gmail.com",
                               "username" : "testuser3"
                           });
                           done();
                        });
                });
        });
        it('should return an error message if user already exists', function (done) {
            var newUser = {
                "username": "testuser2",
                "password": "testPassword2",
                "email": "testuser2@gmail.com"
            };
            chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Username or Email already exists.');
                    done();
                });
        });
        it('should return an error message if user left some or all fields empty', function (done) {
            var newUser = {
                "username": "",
                "password": "",
                "email": "testuser2@gmail.com"
            };
            chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Ensure username, email and password were provided.');
                    done();
                });
        });
    });
    describe('POST /authenticate', function() {
        it('should return a user authenticated message', function (done) {
            var user = {
                "username": "testuser1",
                "password": "testPassword1"
            };
            chai.request(server)
                .post('/api/authenticate')
                .send(user)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User Authenticated!');
                    done();
                });
        });
        it('should return a could not authenticate user message', function (done) {
            var user = {
                "username": "testuser",
                "password": "testPassword"
            };
            chai.request(server)
                .post('/api/authenticate')
                .send(user)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').equal('Could not authenticate user.');
                    done();
                });
        });
        it('should return a could not authenticate password message', function (done) {
            var user = {
                "username": "testuser1",
                "password": "testPassword"
            };
            chai.request(server)
                .post('/api/authenticate')
                .send(user)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').equal('Could not authenticate password!');
                    done();
                });
        });
        it('should return a could not authenticate password message', function (done) {
            var user = {
                "username": "testuser1",
                "password": ""
            };
            chai.request(server)
                .post('/api/authenticate')
                .send(user)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').equal('No password provided!');
                    done();
                });
        });
    });
});