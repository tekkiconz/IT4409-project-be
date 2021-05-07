const Coffee = require('./src/coffee');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const routes = require(`./app-routes/routes`);

const app = Coffee();

app.use(cors());
app.use('/', (req, res) => {
  res.send("hello");
})

app.get('/test', (req, res)=>{
    res.end('TEST GET OK');
})

app.post('/test', (req, res)=>{
    console.log(req);
    res.end('TEST POST OK');
})

app.listen(3000, () => {
  console.log("This app is running on port 3000");
})