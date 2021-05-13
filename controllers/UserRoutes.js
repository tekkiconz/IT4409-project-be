const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/users/signup', async (req, res) => {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
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
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    await User.findOne({ email: newUser.email })
        .then(profile => {
            if (!profile) {
                res.send("User not exist");
            } else {
                if (newUser.password == profile.password) {
                    data = {
                        username: profile.username,
                        email: profile.email,
                        status: "logged in"
                    }
                    res.cookie('userid', profile.id, { expires: new Date(Date.now() + 900000), httpOnly: true });
                    res.status(200).json(data).end();
                } else {
                    res.status(403).end("Wrong email or password"); // 403 Forbidden
                }
            }
        })
});

router.get('/users/signout', async (req, res) => {
    res.clearCookie('rememberme').status(200).end("Cleared Cookie");
});

const findUserInfo = async uid => {
    await User.findOne({ _id: uid })
        .then((profile) => {
            if (!profile) {
                return null;
            } else {
                var user = {
                    username: profile.username,
                    email: profile.email
                };
                return user;
            }
        })
}

router.get('/users/info', async (req, res) => {
    var uid = req.query.id;
    var info = findUserInfo(uid);
    if (info == null) {
        res.status(404).end(`Can't get user's info`);
    } else {
        res.status(200).json(info).end();
    }
});

router.get('/users/currentuser', (req, res) => {
    if (!req.cookie) {
        res.status(404).end('Current User is not set');
    } else {
        var uid = res.cookie.userid;
        console.log("current user id :", uid);

        var info = findUserInfo(uid);
        if (info == null) {
            res.status(404).end(`Can't get current user's info`);
        } else {
            res.status(200).json(info).end();
        }
    }
})

module.exports = router;