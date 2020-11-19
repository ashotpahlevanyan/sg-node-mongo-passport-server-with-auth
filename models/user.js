const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String }
});

// On save hook, encrypt password
// Before saving a model run this function
userSchema.pre('save', async function(next){
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});


// create the model class
const ModelClass = mongoose.model('user', userSchema);


// export the model
module.exports = ModelClass;

