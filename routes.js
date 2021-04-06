const _url = require(`url`);

const registerHandler = require(`./controllers/register-handler`);
const loginHander = require(`./controllers/login-handler`)

const requestHandler = (req, res) => {
    const [url, query] = req.url.split("?")
    const method = req.method;

    console.log(url);
    console.log(query);

    if (url === `/register`) {
        return registerHandler(req, res);
    }
    if (url === `/login`) {
        return loginHander(req, res);
    }
    if (url === `/`) {
        res.statusCode = 200;
        res.write('Server is active on Port 8000!');
        return res.end();
    }
    if (url === `/users`) {
        //Handle api
    }
    if (url === `/files`) {
        //Handle api
    }
    if (url === `/admin`) {
        //Handle api
    }
    res.statusCode = 404;
    res.write(`API not found!`);
    return res.end();
}

module.exports = requestHandler;