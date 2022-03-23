const express = require('express')
const app = express()
const server = require('http').createServer(app)

console.log("Server iniciado!")
app.use('/', (req, res) => {
    res.send("Hello world!")
})

server.listen(80);