require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const userMethods = {
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find().select('username created').exec()
            res.json(resFormat(true,msg.successGetUsers,users))
        }
        catch (err) {
            res.json(resFormat(false,null,err))
        }
    },
    userLogin: async (req,res)=>{
        try {
            let username = req.body.username
            let password = req.body.password
            let getUser = await User.findOne({ username: username })
            if (getUser) {
                let comparePassword = await bcrypt.compare(password, getUser.password)
                let token = signToken(username)
                if (comparePassword) {
                    res.json(resFormat(true,msg.successLogin,{ token: token }))
                }
                else {
                    res.json(resFormat(false,msg.incorrectUsernamePassword,null))
                }
            }
            else {
                res.json(resFormat(false,msg.incorrectUsernamePassword,null))
            }
        }
        catch (err) {
            res.json(resFormat(false,null,err))
        }
    },
    userRegister: async (req,res)=>{
        try {
            let username = req.body.username
            let password = req.body.password
            let encryptedPassword = await bcrypt.hash(password, 10)
            let newUser = new User({
                username: username,
                password: encryptedPassword
            })
            newUser.save()
            let token = signToken(username)
            res.json(resFormat(true,msg.successLogin,{ token: token }))
        }
        catch (err) {
            res.json(resFormat(false,null,err))
        }
    }
}
function signToken(username) {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '2h' })
}
module.exports = userMethods;