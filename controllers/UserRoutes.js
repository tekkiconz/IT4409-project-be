const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const User = require('../models/user');

router.post('/users/signup', async (req, res) => {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email   : req.body.email
    });

    await User.findOne({ email: newUser.email })
        .then(async profile => {
            if (!profile) {
                await newUser
                    .save()
                    .then(() => {
                        res.status(200).json(newUser).end();
                    })
                    .catch(err => {
                        console.log("Error: ", err.message);
                    });
            } else {
                res.end("User already exists...");
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });
});

router.post('/users/login', async (req, res) => {
    var newUser = {};
    newUser.email    = req.body.email;
    newUser.password = req.body.password;
    
    await User.findOne({email : newUser.email})
        .then(profile => {
            if(!profile){
                res.send("User not exist");
            } else {
                if(newUser.password == profile.password){
                    data = {
                        username : profile.username,
                        email: profile.email,
                        status : "logged in"
                    }
                    res.status(200).json(data).end();
                } else {
                    res.status(403).end("Wrong email or password"); // 403 Forbidden
                }
            }
        })
});

module.exports = router;