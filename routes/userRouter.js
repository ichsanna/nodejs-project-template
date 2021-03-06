const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const userController = require('../controllers/userController')

router.post('/login', userController.userLogin)
router.post('/register', userController.userRegister)
router.get('/getusers', auth, userController.getAllUsers)
router.get('/getuser/:id', auth, userController.getUserById)

module.exports = router;