const cors = require('cors');
const fs = require('fs');
const path = require('path');

const Coffee = require('./src/coffee');

const app = Coffee();

app.use(cors());
app.use('/about', (req, res) => {
  res.send('I am the about page');
});

app.use('/', (req, res) => {
  res.send("HelloWorld");
});

const server = app.listen(3000, () => console.log(`Server running on 3000`));