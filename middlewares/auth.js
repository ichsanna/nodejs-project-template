require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('./../models/user')
const resFormat = require('../configs/response-format')
const msg = require('../configs/response-messages')

async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        let decoded =  jwt.verify(token, process.env.JWT_SECRET)
        let username = decoded.username
        let user = await User.findOne({username: username})
        if (user) next()
    } catch (err) {
        return res.status(401).json(resFormat(false,msg.failedAuth,err));
    }
}


module.exports = verifyToken