const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingRequestSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const gearSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  equipment: String,
  image: String,
  category: String,
  owner: String,
  isAvailable: {
    type: Boolean,
    default: true,
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookingRequests: [bookingRequestSchema],
  totalRented: {
    type: Number,
    default: 0,
  }
});

const Gear = mongoose.model('Gear', gearSchema);
module.exports = Gear;
