const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path');
const arduinoData = require('./middlewares/dataFetching')
const io = require('socket.io')(server);

/* Define public files on server and HTML to render */
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* Safety margin for possible sensor reading errors */
const SENSOR_TEMP_SECURITY_MARGIN ={
    MAX: 40,
    MIN: 0
} 

/* Delay to fetch data from station and emit to sockets. 1 = one minute.*/
const UPDATE_TIME = 1;

const stationData = {
    TempMin: 0, 
    TempCurrent: 0, 
    TempMax: 0, 
    pressure: 0, 
    chartData:[NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN , NaN, NaN, NaN, NaN, NaN], 
    location: "Mata Verde - MG" }

/* Fetch data from station and call `dataProcessing` function */
setInterval(() => { 
    arduinoData.fetch().then(response => dataProcessing(response)).catch((error) => console.log(error.message));
 }, 60 * (UPDATE_TIME * 1000));

/* Process, check and update changes in `stationData` values */
function dataProcessing(response){
    console.log("updated!")
    if(response.data.temperature < stationData.TempMin && response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempMin = response.data.temperature;
    }
    if(response.data.temperature > stationData.TempMax && response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempMax = response.data.temperature;
    }
    if(response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempCurrent = response.data.temperature;
        stationData.pressure = data.sensor.pressure;
    }
    
}

/* Rendering ´index.html´ when user access Default server address */
app.use('/', (req, res) => {
    res.render('index.html');
})

/* Verify if a new user is connected and emit ´stationData´ every time after ´UPDATE_TIME´ */
io.on('connection', socket => {
    socket.emit('stationData', stationData);
    console.log(`Socket Conectado: ${socket.id}`);
    setInterval(() => { 
        socket.emit('stationData', stationData);
     }, 60 * (UPDATE_TIME * 1000));
});

/* Listen server port 80 = http */
server.listen(80);