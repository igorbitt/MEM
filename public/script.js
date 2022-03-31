var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
        datasets: [{
            cubicInterpolationMode: 'monotone',
            tension: 5,
            data: [],
            label: 'Temperatura',
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

function renderStationData(id, data, unit){
    document.getElementById(id).innerHTML = data + unit;
}

function renderChart(dataToChart){
    myChart.data = {
        labels: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
        datasets: [{
            cubicInterpolationMode: 'monotone',
            tension: 5,
            data: dataToChart,
            label: 'Temperatura',
            backgroundColor: [
                'rgba(48, 134, 219, 0.5)'],
            borderColor: [
                'rgba(48, 134, 219, 1)',],
            borderWidth: 1
        }]
    }
    myChart.update();
}

var socket = io(window.location.hostname);

socket.on('stationData', function(stationData){
    renderStationData("minTemperature", stationData.TempMin, "°C");
    renderStationData("currentTemperature", stationData.TempCurrent, "°C");
    renderStationData("maxTemperature", stationData.TempMax, "°C");
    renderStationData("pressure", stationData.pressure, " hPa");
    renderStationData("localization", stationData.location, "");
    renderChart(stationData.chartData);
}); 