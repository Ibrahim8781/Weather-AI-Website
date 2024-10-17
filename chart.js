// Function to initialize and display the charts
function initializeCharts(forecastData) {
    const labels = forecastData.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const temperatures = forecastData.map(forecast => forecast.main.temp);
    const weatherConditions = forecastData.map(forecast => forecast.weather[0].main);

    // Data for weather conditions (to display in the doughnut chart)
    const conditionCounts = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const conditionLabels = Object.keys(conditionCounts);
    const conditionValues = Object.values(conditionCounts);

    // 1. Bar Chart (Temperature)
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                delay: 500, // Delay animation
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 2. Doughnut Chart (Weather Conditions)
    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
    const doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: conditionLabels,
            datasets: [{
                label: 'Weather Conditions',
                data: conditionValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                delay: 500, // Delay animation
            }
        }
    });

    // 3. Line Chart (Temperature Trends)
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            animation: {
                onComplete: () => {
                    console.log('Animation complete');
                },
                easing: 'easeOutBounce', // "Drop" animation
                duration: 1000,
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
