const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const db = require('./helpers/configs').CONNECTION_STRING;

app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extened: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

mongoose
  .connect(db)
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log("Error: ", err.message);
  });

var userRoutes = require('./controllers/UserRoutes');
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})