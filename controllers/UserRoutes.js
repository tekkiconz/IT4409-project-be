const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Activity = require('../models/activity');
const auth = require('./middleware/auth');

// POST /api/users/signup
router.post('/signup', async (req, res) => {

    await User.findOne({ email: req.body.email })
        .then(async profile => {
            if (!profile) {
                const newUser = await new User({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                })
                    .save()
                    .then(() => {
                        var id = newUser.id
                        res.cookie('userid', id, { expires: new Date(Date.now() + 900000), httpOnly: true });
                        res.status(200).json(newUser).end();
                    })
                    .catch(err => {
                        console.log("Error: ", err.message);
                        res.status(400).json({ message: `Error: ${err.message}` });
                    });
            } else {
                res.status(409).json({ message: "User already exist" })
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    console.log("cookie:", req.headers.cookie);
    console.log(req.body);
    var newUser = {};
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    await User.findOne({ email: newUser.email })
        .then(profile => {
            if (!profile) {
                res.json({ message: "user not exist" });
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
                    res.status(403).json({ message: "Wrong email or password" }); // 403 Forbidden
                }
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

// GET /api/users/signout
router.get('/signout', async (req, res) => {
    res.clearCookie('userid').status(200).json({ message: "Cookie Cleared" });
});

// GET /api/users/info
router.get('/info', async (req, res) => {
    var uid = req.body.id;
    console.log(uid);
    await User.findOne({ _id: uid })
        .then((profile) => {
            if (!profile) {
                res.status(404).json({ message: `Can't get user's info with _id : ${uid}` });
            } else {
                res.status(200).json({
                    username: profile.username,
                    email: profile.email
                }).end();
            }
        });
});

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

// GET /api/users/currentuser
router.get('/currentuser', async (req, res) => {
    console.log("cookie:", req.headers.cookie);
    var cookie = req.headers.cookie;
    if (!cookie) {
        res.status(200).json({});
    } else {
        var cookies = cookie.split('; ');
        var tmp = cookies[0];
        console.log(tmp);
        var uid = tmp.split('=');
        var id = uid[1];
        console.log("current user id :", id);

        await User.findOne({ _id: id })
            .then((profile) => {
                if (!profile) {
                    res.status(401).json({ message: "Invalid token" });
                } else {
                    res.status(200).json({
                        username: profile.username,
                        email: profile.email
                    }).end();
                }
            });
    }
});


router.get('/history', auth, async (req, res) => {

    var uid = req.user._id;
    console.log(uid)

    await Activity.find(uid ? { userid: uid } : {})
        .then(data => {
            if (!data) {
                res.status(200).end('Empty history');
            } else {
                res.status(200).json(data).end();
            }
        })
        .catch(err => {
            console.log(`Error: ${err.message}`)
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

module.exports = router;