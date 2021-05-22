const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const categoryModel = require('./models/category');

const db = require('./helpers/configs').CONNECTION_STRING;
const initial_cats = require('./helpers/configs').INIT_CATEGORIES;

app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extened: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;

mongoose
  .connect(db, { useFindAndModify: false })
  .then(() => {
    console.log("Database is connected");
    console.log(initial_cats);
    categoryModel.insertMany({
      initial_cats
    }).then(() => {
      console.log('Init categories');
    })
    .catch(err => {
      console.log("error when init categories");
      console.log(err.message);
    })
  })
  .catch(err => {
    console.log("Error: ", err.message);
  });

var userRoutes = require('./controllers/UserRoutes');
var bookRoutes = require('./controllers/BookRoutes');

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})