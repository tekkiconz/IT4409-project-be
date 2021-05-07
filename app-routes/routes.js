// const _url = require(`url`);
const mongoose = require('mongoose')

const registerHandler = require(`../controllers/register-handler`);
const loginHandler = require(`../controllers/login-handler`);
const apiHandler = require('../controllers/api-handler');

// handle request
const requestHandler = (req, res) => {
    const [url, query] = req.url.split("?")
    const method = req.method;

    console.log('New request')
    console.log('URL: ',url);
    console.log('Query: ',query);
    console.log('Method: ', method);

    if (url === `/register`) {
        return registerHandler(req, res);
    }
    else if (url === `/login`) {
        return loginHandler(req, res);
    }
    else if (url === `/`) {
        res.statusCode = 200;
        res.write('Server is active on Port 8000!');
        return res.end();
    }
    else if (url === `/users`) {
        //Handle api
    }
    else if (url === `/files`) {
        //Handle api
    }
    else if (url === `/admin`) {
        //Handle api
    }
    else {      // for API
        switch(method){
            case 'GET':
                return apiHandler.getHandle(req, res);                
            case 'POST':
                return apiHandler.postHandle(req, res);
            case 'DELETE':
                return apiHandler.deleteHandle(req, res);
            case 'PUT':
                return apiHandler.putHandle(req, res);
        }
        
    }


    res.statusCode = 404;
    res.write(`API not found!`);
    return res.end();
}

module.exports = requestHandler;