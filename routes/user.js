const { application } = require('express');
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.render('user');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router