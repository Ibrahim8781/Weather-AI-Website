
let barChart, doughnutChart, lineChart;

function initializeCharts(forecastData) {
    const chartsContainer = document.getElementById('charts-container');
    if (!forecastData || forecastData.length === 0) {
        chartsContainer.style.display = 'none';
        return;
    }
    chartsContainer.style.display = 'flex';

    const labels = forecastData.slice(0, 5).map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const temperatures = forecastData.slice(0, 5).map(forecast => forecast.main.temp);
    const weatherConditions = forecastData.slice(0, 5).map(forecast => forecast.weather[0].main);

    // doughnut chart
    const conditionCounts = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const conditionLabels = Object.keys(conditionCounts);
    const conditionValues = Object.values(conditionCounts);

    // finish previous charts 
    function destroyChart(chart) {
        if (chart) {
            chart.destroy();
        }
    }

    // Common options for all charts
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#333'
                }
            }
        }
    };

    // Bar Chart 
    destroyChart(barChart);
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(30, 144, 255, 0.6)',
                borderColor: 'rgba(30, 144, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#333' }
                },
                x: {
                    ticks: { color: '#333' }
                }
            },
            animation: {
                delay: 500
            }
        }
    });

    // Doughnut Chart 
    destroyChart(doughnutChart);
    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
    doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: conditionLabels,
            datasets: [{
                label: 'Weather Conditions',
                data: conditionValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            ...commonOptions,
            animation: {
                delay: 500
            }
        }
    });

    // Line Chart 
    destroyChart(lineChart);
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(30, 144, 255, 1)',
                tension: 0.1
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#333' }
                },
                x: {
                    ticks: { color: '#333' }
                }
            },
            animation: {
                onComplete: () => {
                    console.log('Animation complete');
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            }
        }
    });
}

// hide charts when no city is entered
function hideCharts() {
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', hideCharts);

window.initializeCharts = initializeCharts;
window.hideCharts = hideCharts;