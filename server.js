const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const searchRouter = require('./routes/search')
const apiRouter = require('./api/api')
const userRouter = require('./routes/user')
const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/airline');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

app.listen(5000);