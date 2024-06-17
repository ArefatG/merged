const mongoose = require('mongoose');
const { Schema } = mongoose;

const balanceRecordSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    minlength: 3,
  },
  photoURL: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  license: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  balanceHistory: [balanceRecordSchema],
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
