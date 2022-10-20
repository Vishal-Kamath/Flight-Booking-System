const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  flight_id: {
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
  status: {
    type: String,
    required: true
  },
  booking_id: {
    type: String,
  }
});

module.exports = mongoose.model('Seat', seatSchema);