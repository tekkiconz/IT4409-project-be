const User = require('../models/account-model');
const mongoose = require('mongoose');
const http = require('http');

const registerHandler = (req, res) => {
    //Handle register request
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    var ok = 1
    console.log(body)
    req.on('end', async function (ok) {
        // console.log("Body: " + body);
        var user = JSON.parse(body)
        const username = user.username
        const plainTextPassword = user.password 
        const email = user.email
        const password = plainTextPassword

        if(!username || typeof username != 'string'){
            return
        }

        if(!password || typeof password != 'string'){
            return
        }
        
        if(password.length < 6){
            return
        }

        try{
            const response = await User.create({
                username, 
                password,
                email
            })
            console.log('User create successfullly', response)
        }catch(error){
            // console.error(error);
            if(error.code === 11000){
                return
            }
            throw error
        }

    });
    return res.end(`{"Status" : "${http.STATUS_CODES[res.statusCode]}"}`);
}

module.exports = registerHandler;