const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')
const mongoose = require('mongoose')
const resFormat = require('./configs/response-format')
const msg = require('./configs/response-messages')

require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use('/api', apiRoutes)

app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json(resFormat(false,msg.invalidRoute,null));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000')
});