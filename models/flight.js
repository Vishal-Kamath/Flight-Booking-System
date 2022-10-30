const mongoose = require('mongoose');
const Seat = require('../models/seat');
const generateUUID = require('./utilities/generateUUID');

const flightSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    required: true,
    unique: true
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
  },
  sourceAirport: {
    type: String,
    required: true
  },
  destinationAirport: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

flightSchema.pre('validate', function(next) {
  this.flight_id = generateUUID();
  next()
})

flightSchema.pre('save', async function(next) {
  let Seats = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let seatRow = 1; seatRow <= 15; seatRow++) {
    Seats.forEach(async seatColumn => {
      let seat = new Seat({
        flight_id: this.flight_id,
        seatRow: seatRow,
        seatColumn: seatColumn,
        status: 'Active',
        booking_id: 'None',
      })
      try {
        seat = await seat.save();
      } 
      catch (err) { 
        console.log(err)
      }
    });
  }
  next()
});

module.exports = mongoose.model('Flight', flightSchema);