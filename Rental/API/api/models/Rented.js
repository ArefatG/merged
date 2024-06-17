const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentedSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  gearItems: [
    {
      gearId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gear',
        required: true,
      },
      name: String,
      price: Number,
      startDate: Date,
      endDate: Date,
      uniqueCode: {
        type: String,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  txRef: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  collected: {
    type: Boolean,
    default: false,
  },
});

const Rented = mongoose.model('Rented', rentedSchema);
module.exports = Rented;
