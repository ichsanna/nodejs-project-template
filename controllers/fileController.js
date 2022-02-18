require('dotenv').config()
const fs = require('fs')

const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const fileMethods = {
    uploadFile: (req, res) => {
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
    },
    downloadFile: (req, res) => {
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
    }
}

module.exports = fileMethods;