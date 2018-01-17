var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt-nodejs');
var Schema      = mongoose.Schema;


var userSchema = new Schema({
   username: { type: String, lowercase: true, required: true, unique: true},
   password: { type: String, required: true},
   email: { type: String, required: true, lowercase: true, unique: true}
});

userSchema.pre('save', function(next) {

   var user = this;
   bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
   });
});

// Function used to compare user password against database.
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);