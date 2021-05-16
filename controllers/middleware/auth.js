const User = require('../../models/user')
const express = require('express');
const router = express.Router();

const auth = async(req, res, next) => {
    try {
        var cookie = req.headers.cookie;
        // console.log(cookie)
        var cookies = cookie.split(';');
        var tmp = cookies[0];
        var id = tmp.split('=')
        // console.log(id)
        var uid = id[1];
        const user = await User.findOne({ _id: uid})
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}

module.exports = auth