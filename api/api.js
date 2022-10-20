require('dotenv').config()

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Flight = require('../models/flight');
const Seat = require('../models/seat');
const Booking = require('../models/booking');
const RefreshToken = require('../models/refreshToken');
const router = express.Router();


function AuthorizationUser(req, res, next) {
  const authHeader = req.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
  })
  next();
}

router.get('/users', AuthorizationUser,  async (req, res) => {
  let user = req.user;
  user = await User.findOne({ username: user.username});
  if (!user) return res.sendStatus(404);

  res.send(user);
});


router.get('/users/bookingDetails', AuthorizationUser,  async (req, res) => {
  let user = req.user;
  user = await User.findOne({ username: user.username});
  if (!user) return res.sendStatus(404);

  if(req.query.booking) {
    let booking = await Booking
      .find({ userId: user._id })
      .distinct('bookingGroupId')
      return res.send([user, booking]);
  }

  if(req.query.bookingGroupId) {
    let booking = await Booking
      .find({ 'bookingGroupId.id': req.query.bookingGroupId })
    return res.send(booking);
  }
});

router.delete('/users/bookingDetails', AuthorizationUser,  async (req, res) => {
  let user = req.user;
  user = await User.findOne({ username: user.username});
  if (!user) return res.sendStatus(404);

  let booking = await Booking.findByIdAndDelete(req.query.bookingId);
  
  user.coins = user.coins + booking.price;
  user = await User.findByIdAndUpdate(
    user._id,
    {
      coins: user.coins
    },
    (err) => {
      if(err) return console.log(err);
    }
  ).clone()

  let seat = await Seat.findOneAndUpdate(
    {
      flight_id: booking.flight_id,
      seatRow: parseInt(booking.seatRow),
      seatColumn: booking.seatColumn
    },
    {
      status: 'Active',
      booking_id: 'None'
    },
    (err, seat) => {
      if(err) {
        res.sendStatus(400);
        return console.log(err);
      }
    }
  ).clone()

  res.send(booking.bookingGroupId)

});


router.get('/search', async (req, res) => {
  if (req.query.flight_id) {
    try {
      const flight = await Flight.findOne({ flight_id: req.query.flight_id});
      const seats = await Seat.find({ flight_id: req.query.flight_id});
      return res.send([flight, seats]);
    }
    catch (err) {
      console.log(err);
      return res.sendStatus(404);
    }
  }

  const flights = await Flight.find({ 
    source: req.query.source, 
    destination: req.query.destination
  })
  res.send(flights);
});

router.post('/book', AuthorizationUser, async (req, res) => {
  let user = req.user;
  let { _id } = await User.findOne({ username: user.username})
    .select({_id: 1});

  let userId = JSON.stringify(_id);
  if(!req.query.flight_id) return res.sendStatus(404);
  
  const flight = await Flight.findOne({flight_id: req.query.flight_id});
  if(!flight) return res.sendStatus(404);
  
  let booking = new Booking({
    flight_id: req.query.flight_id,
    userId: userId.slice(1,-1),
    bookingGroupId: {
      id: req.body.groupUUID,
      source: flight.source,
      destination: flight.destination,
      startDateTime: flight.startDateTime
    },
    passengerFirstName: req.body.passengerFName,
    passengerLastName: req.body.passengerLName,
    seatRow: parseInt(req.body.seatRow),
    seatColumn: req.body.seatColumn,
    price: flight.price
  });

  try {
    let user = await User.findById(userId.slice(1,-1));
    user.coins = user.coins - flight.price;

    if(user.coins < 0) {
      res.status(402);
      return res.send({ message: 'insufficient balance'});
    } 
      
    user = await User.findByIdAndUpdate(
      userId.slice(1,-1),
      {
        coins: user.coins
      },
      (err) => {
        if(err) return console.log(err);
      }
    ).clone()
    console.log('user coins')

    booking = await booking.save();
    console.log('booking')
    let seat = await Seat.findOneAndUpdate(
      {
        flight_id: req.query.flight_id,
        seatRow: parseInt(req.body.seatRow),
        seatColumn: req.body.seatColumn
      },
      {
        status: 'Booked',
        booking_id: booking._id
      },
      (err, seat) => {
        if(err) {
          res.sendStatus(400);
          return console.log(err);
        }
      }
    ).clone()
    console.log('seats')
    res.sendStatus(200)
  }
  catch (err) {
    console.log(err);
    res.sendStatus(409)
  }
});

router.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let user = new User({
    username: req.body.username,
    password: hashedPassword,
    name: req.body.name,
    email: req.body.email,
    mobNo: req.body.mobNo
  });

  try {
    user = await user.save()
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err)
  }
});

router.post('/login',async (req, res) => {
  let user = await User.findOne({username: req.body.username});
  if (!user) return res.sendStatus(400);
    

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {}
    else return res.sendStatus(400);
  }
  catch (err) {
    console.log(err);
  }

  // generating access and refresh tokens
  user = { username: user.username}
  const accessToken = generateAccessToken(user)
  // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  // pushing refresh token in DB
  // let refreshTokenObject = new RefreshToken({
  //   token: refreshToken
  // });
  // try {
  //   refreshTokenObject = await refreshTokenObject.save()
  // }
  // catch (err) {
  //   console.log(err)
  // }

  res.json({accessToken: accessToken});
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = router;