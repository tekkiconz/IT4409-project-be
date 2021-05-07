const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Coffee = require('./src/coffee');
const routes = require(`./app-routes/routes`);

const app = Coffee();


const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Starting server on http://${host}:${port}`);
});

app.get("/test", (req, res) => {
  res.end("test ok");
})

app.post('/testPost', (req, res)=>{
  
  console.log(req);
  res.end('Test ok');
})