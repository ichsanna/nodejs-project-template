const fs = require('fs')

const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const fileMethods = {
    uploadFile: (req, res) => {
        try {
            let filename = req.file.originalname
            let filetype = req.file.mimetype
            let filesize = req.file.size
            res.status(201).json(resFormat(true,msg.successUpload,{
                filename: filename,
                filetype: filetype,
                filesize: filesize
            }))
        }
        catch (err) {
            res.status(400).json(resFormat(false,null,err))
        }
    },
    downloadFile: (req, res) => {
        try {
            let filename = req.params.filename
            const location = `${__dirname}/../uploads/`+filename;
            if (fs.existsSync(location)){
                res.status(200).download(location);
            }
            else{
                res.status(404).json(resFormat(false,msg.noFileFound,null))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false,null,err))
        }
    }
}

module.exports = fileMethods;