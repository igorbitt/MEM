const DEFAULT_URL = "localhost"

function renderSensorData(id, data, unit){
    document.getElementById(id).innerHTML = data + unit;
}

function renderChart(dataToChart){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
        datasets: [{
            cubicInterpolationMode: 'monotone',
            tension: 5,
            label: 'Temperatura',
            data: dataToChart,
            backgroundColor: [
                'rgba(48, 134, 219, 0.5)'],
            borderColor: [
                'rgba(48, 134, 219, 1)',],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
                }
            }
        }
    });
}

var socket = io(DEFAULT_URL);

socket.on('stationData', function(stationData){
    renderSensorData("minTemperature", stationData.TempMin, "°C");
    renderSensorData("currentTemperature", stationData.TempCurrent, "°C");
    renderSensorData("maxTemperature", stationData.TempMax, "°C");
    renderSensorData("pressure", stationData.pressure, " hPa");
    renderSensorData("city", stationData.location, "");
    renderChart(SensorData.chartData);
}); 