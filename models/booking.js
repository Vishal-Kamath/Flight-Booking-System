const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  bookingGroupId: {
    id: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    startDateTime: {
      type: Date,
      required: true
    },
    endDateTime: {
      type: Date,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passengerFirstName: {
    type: String,
    required: true
  },
  passengerLastName: {
    type: String,
    required: true
  },
  seatRow: {
    type: Number,
    required: true
  },
  seatColumn: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Booking', bookingSchema);