const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const upload = require('../configs/fileUploads')
const fileController = require('../controllers/fileController')

router.post('/upload', auth, upload.single("input-file"), fileController.uploadFile)
router.get('/download/:filename', fileController.downloadFile)

module.exports = router;