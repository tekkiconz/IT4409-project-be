const _url = require(`url`);

const registerHandler = require(`./controllers/register-handler`);
const loginHander = require(`./controllers/login-handler`)

const requestHandler = (req, res) => {
    const [url, query] = req.url.split("?")
    const method = req.method;

    const [,route] = url.split("/");

    const post = `post`;

    const filter = {

    };

    console.log(route);
    console.log(query);

    if (route === `user`) {
        return registerHandler(req, res);
    }
    if (url === `product`) {
        return loginHander(req, res);
    }
    if (url === `admin`){
        return ;
    }
    if (url === `/`) {
        res.statusCode = 200;
        res.write('Good morning! Server is currerntly active.');
        return res.end();
    }
    res.statusCode = 404;
    res.write(`API not found!`);
    return res.end();
}

module.exports = requestHandler;