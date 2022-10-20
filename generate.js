const mongoose = require('mongoose');
const Flight = require('./models/flight')

mongoose.connect('mongodb://localhost/airline');

async function createFlight() {
  let flight = new Flight({
    source: 'Mumbai',
    destination: 'Pune',
    startDateTime: new Date('2023-10-25T12:00:00Z'),
    endDateTime: new Date('2023-10-25T13:00:00Z'),
    sourceAirport: 'mumbai airport',
    destinationAirport: 'pune airport'
  });
  try {
    flight = await flight.save();
    console.log(JSON.stringify(flight));
  }
  catch (err) {
    console.log(err)
  }
}

createFlight();