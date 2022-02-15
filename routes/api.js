require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const User = require('../models/user')
const auth = require('../middlewares/auth')
const upload = require('../configs/file-uploads')
const msg = require('../configs/response-messages')
const resFormat = require('../configs/response-format')
const router = express.Router()

router.post('/login', async (req, res) => {
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
})
router.post('/register', async (req, res) => {
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
})
router.get('/getusers', auth, async (req, res) => {
    try {
        let users = await User.find().select('username created').exec()
        res.json(resFormat(true,msg.successGetUsers,users))
    }
    catch (err) {
        res.json(resFormat(false,null,err))
    }
})
router.post('/uploadfile', upload.single("input-file"), (req, res) => {
    try {
        let filename = req.file.originalname
        let filetype = req.file.mimetype
        let filesize = req.file.size
        res.json(resFormat(true,msg.successUpload,{
            filename: filename,
            filetype: filetype,
            filesize: filesize
        }))
    }
    catch (err) {
        res.json(resFormat(false,null,err))
    }
})
router.get('/downloadfile/:filename', (req, res) => {
    try {
        let filename = req.params.filename
        const location = `${__dirname}/../uploads/`+filename;
        if (fs.existsSync(location)){
            res.download(location);
        }
        else{
            res.json(resFormat(false,msg.noFileFound,null))
        }
    }
    catch (err) {
        res.json(resFormat(false,null,err))
    }
})

function signToken(username) {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '2h' })
}

module.exports = router;