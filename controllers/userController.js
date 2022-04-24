const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const userMethods = {
    getUserById: async (req, res) => {
        try {
            let data = async () => {
                let id = req.params.id
                let data = await User.findById(id).select('username created')
                if (data) {
                    return { status: 200, data: resFormat(true, msg.successGetUser, data) }
                }
                return { status: 404, data: resFormat(false, msg.noUser, data) }
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let data = async () => {
                let users = await User.find().select('username created').exec()
                if (users) {
                    return { status: 200, data: resFormat(true, msg.successGetUsers, data) }
                }
                return { status: 404, data: resFormat(false, msg.noUser, data) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userLogin: async (req, res) => {
        try {
            let data = async () => {
                let { username, password } = req.body
                let getUser = await User.findOne({ username: username })
                if (getUser) {
                    let comparePassword = await bcrypt.compare(password, getUser.password)
                    let token = signToken(username)
                    if (comparePassword) {
                        return { status: 200, data: resFormat(true, msg.successLogin, { token: token }) }
                    }
                    return { status: 401, data: resFormat(false, msg.incorrectUsernamePassword, null) }
                }
                return { status: 404, data: resFormat(false, msg.incorrectUsernamePassword, null) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userRegister: async (req, res) => {
        try {
            let data = async () => {
                let { username, password } = req.body
                let getUser = await User.findOne({ username: username }).select('username created')
                if (getUser) {
                    return { status: 409, data: resFormat(false, msg.duplicateUsername, null) }
                }
                else {
                    let encryptedPassword = await bcrypt.hash(password, 10)
                    let newUser = new User({
                        username: username,
                        password: encryptedPassword
                    })
                    newUser.save()
                    let token = signToken(username)
                    return { status: 201, data: resFormat(true, msg.successLogin, { token: token }) }
                }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
function signToken(username) {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '2h' })
}
module.exports = userMethods;