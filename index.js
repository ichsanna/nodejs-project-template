require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const userRoutes = require('./routes/userRouter')
const fileRoutes = require('./routes/fileRouter')
const resFormat = require('./configs/responseFormat')
const msg = require('./configs/responseMessages')

const app = express()

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use('/api/user', userRoutes)
app.use('/api/file', fileRoutes)

app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json(resFormat(false,msg.invalidRoute,null));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000')
});