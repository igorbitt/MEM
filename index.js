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

/* Clean the console and print startup server message*/
process.stdout.write('\033c');
console.log('Servidor iniciado!')

/* Safety margin for possible sensor reading errors */
const SENSOR_TEMP_SECURITY_MARGIN ={
    MAX: 40,
    MIN: 0
} 

/* Delay to fetch data from station and emit to sockets. 1 = one minute.*/
const UPDATE_TIME = 1000 * 60 * 1

const stationData = {
    TempMin: 0, 
    TempCurrent: 0, 
    TempMax: 0, 
    pressure: 0, 
    chartData:[], 
    location: "Mata Verde - MG" }

/* Process, check and update changes in `stationData` values */
function dataProcessing(response){
    if(stationData.TempMin == 0 && stationData.TempMax == 0){
        stationData.TempMax = response.data.temperature;
        stationData.TempMin = response.data.temperature;
    }
    if(response.data.temperature < stationData.TempMin && response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempMin = response.data.temperature;
    }
    if(response.data.temperature > stationData.TempMax && response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempMax = response.data.temperature;
    }
    if(response.data.temperature > SENSOR_TEMP_SECURITY_MARGIN.MIN && response.data.temperature < SENSOR_TEMP_SECURITY_MARGIN.MAX){
        stationData.TempCurrent = response.data.temperature;
        stationData.pressure = response.data.pressure;
        chartUpdate(response);
    }else{
        console.log("Erro na leitura do sensor, leitura não será enviada ao site >> " + response.data.temperature + "°C")
    }
}

/* Process, check and update changes in `stationData` values
   If you want to add more monitoring columns, just implement
   the time in `switch` and in `/src/script.js` add the time in 
   labels. it's done!                                        */
function chartUpdate(response){
    var date = new Date();
    var time = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
    switch(time){
        case "18:00":
            stationData.chartData[0] = response.data.temperature;
            break;
        
        case "19:00":
            stationData.chartData[1] = response.data.temperature;
            break;

        case "20:00":
            stationData.chartData[2] = response.data.temperature;
            break;

        case "21:00":
            stationData.chartData[3] = response.data.temperature;
            break;

        case "22:00":
            stationData.chartData[4] = response.data.temperature;
            break;

        case "23:00":
            stationData.chartData[5] = response.data.temperature;
            break;

        case "00:00":
            stationData.chartData[6] = response.data.temperature;
            break;

        case "01:00":
            stationData.chartData[7] = response.data.temperature;
            break;

        case "02:00":
            stationData.chartData[8] = response.data.temperature;
            break;

        case "03:00":
            stationData.chartData[9] = response.data.temperature;
            break;

        case "04:00":
            stationData.chartData[10] = response.data.temperature;
            break;

        case "05:00":
            stationData.chartData[11] = response.data.temperature;
            break;

        case "06:00":
            stationData.chartData[12] = response.data.temperature;
            break;
    }
    console.log(date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + " - " + response.data.temperature + "°C");
}

/* Rendering ´index.html´ when user access Default server address */
app.use('/', (req, res) => {
    res.render('index.html');
})

/* Verify if a new user is connected and emit ´stationData´ every time after ´UPDATE_TIME´ */
io.on('connection', socket => {
    socket.emit('stationData', stationData);
    console.log(`Socket Conectado: ${socket.id}`);
});

setInterval( function(){ 
    arduinoData.fetch().then(response => {
        dataProcessing(response); 
        io.emit('stationData', stationData);
    }).catch((error) => console.log(error.message));
    }, UPDATE_TIME);

/* Fetch data from station and call `dataProcessing` function for the first fetch */
arduinoData.fetch().then(response => {
    dataProcessing(response); 
    io.emit('stationData', stationData);
}).catch((error) => console.log(error.message));

/* Listen server port 80 = http */
server.listen(80);