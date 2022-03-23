const express = require('express')
const app = express()
const server = require('http').createServer(app)
const data = require('./middlewares/dataFetching')


//console.log("Server iniciado!")
app.use('/', (req, res) => {
    res.send("Hello world!")
    
})

data.fetch().then(data => {
    console.log(data)
})

server.listen(80);