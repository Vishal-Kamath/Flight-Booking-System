const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }, 
  mobNo: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    default: 10_000
  }
});

module.exports = mongoose.model('User', userSchema);