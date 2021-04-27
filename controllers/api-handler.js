const http      = require('http');
var MongoClient = require('mongodb').MongoClient;
const mongoose  = require('mongoose');
const BookModel = require('../models/book-model');
const dbRoute   = require('../app-routes/db-route');


// Connect database
const CONNECTION_STRING = 'mongodb://localhost:27017/bookshare-account';

mongoose.connect(CONNECTION_STRING, 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const handleGetRequest = (req, res) => {
    const [path, query] = req.url.split("?")
    if(path === '/api/books'){
        BookModel.find()
        .then(data => {
            if(data){
                console.log(data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));                
            } else {
                return handleError(res, 400);
            }
        }).catch(e => {console.log("err")});
    } else if (path === '/api/users'){
        // get all users' information
    } else {
        return handleError(res, 404);
    }

    res.setHeader('Content-Type', 'application/json;charset=utf-8');
}

const handlePostRequest = (req, res) => {

}

const handleDeleteRequest = (req, res) => {

}

const handlePutRequest = (req, res) => {

}

const handleError = (res, code) => {
    res.statusCode = code;
    res.end(`{"Error" : "${http.STATUS_CODES[code]}"}`);
}

exports.getHandle       = handleGetRequest;
exports.postHandle      = handlePostRequest;
exports.deleteHandle    = handleDeleteRequest;
exports.putHandle       = handlePutRequest;