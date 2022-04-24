const fs = require('fs')

const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const fileMethods = {
    uploadFile: (req, res) => {
        try {
            let data = async () => {
                let { filename, filetype, filesize } = req.file
                return {
                    status: 201, data: resFormat(true, msg.successUpload, {
                        filename: filename,
                        filetype: filetype,
                        filesize: filesize
                    })
                }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    downloadFile: (req, res) => {
        try {
            let data = async () => {
                let filename = req.params.filename
                const location = `${__dirname}/../uploads/` + filename;
                if (fs.existsSync(location)) {
                    return { status: 200, data: location }
                }
                else {
                    return { status: 404, data: resFormat(false, msg.noFileFound, null) }
                }
            }
            let resp = await data()
            if (resp.status === 200 ) res.status(resp.status).download(resp.data);
            else res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}

module.exports = fileMethods;