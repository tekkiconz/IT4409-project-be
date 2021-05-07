const cors = require('cors');
const fs = require('fs');
const path = require('path');

const routes = require(`./app-routes/routes`);

const app = Coffee();


const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

server.listen(port, host, () => {
  console.log(`Starting server on http://${host}:${port}`);
});
