const express = require('express');
const mongoose = require('mongoose');
const searchRouter = require('./routes/search')
const apiRouter = require('./api/api')
const userRouter = require('./routes/user')
const app = express();

mongoose.connect('mongodb://localhost/airline');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

app.listen(5000);