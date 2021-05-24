const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const db = require('./helpers/configs').CONNECTION_STRING;

app = express();

app.use(cors(
  { credentials: true, origin: 'http://localhost:3000' }
));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extened: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;

mongoose
  .connect(db, { useFindAndModify: false })
  .then(() => {
    console.log("Database is connected");
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