const http = require(`http`);

const routes = require(`./app-routes/routes`);

const server = http.createServer(routes);


const host = process.env.HOST ||'localhost';
const port = process.env.PORT || 8000;

server.listen(port, host, () => {
    console.log(`Starting server on http://${host}:${port}`);
});