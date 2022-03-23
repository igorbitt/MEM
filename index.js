const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path');
const arduinoData = require('./middlewares/dataFetching')


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//console.log("Server iniciado!")
app.use('/', (req, res) => {
    res.render('index.html');
    //getData()
})

function getData(){
    arduinoData.fetch().then(response => console.log(response));
}


server.listen(80);