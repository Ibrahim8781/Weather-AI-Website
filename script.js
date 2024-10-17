// OpenWeather API Key (replace with your own API key)
const API_KEY = 'e369669c1117bdefabd691ce097eaf70';

// Global Variables for Pagination
let currentPage = 1;
const rowsPerPage = 10; // Display 10 entries per page (updated)
let originalForecast = []; // Original forecast data (used for resetting filters)
let filteredForecast = [];
let sortAscending = true;

// Function to get current weather data for the given city
async function getWeatherData(city) {
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();

        // Error handling if the city is not found
        if (weatherData.cod === '404') {
            displayError('City not found. Please try again.');
            return;
        }

        // Display current weather data
        displayCurrentWeather(weatherData);

        // Fetch and display the 10-day forecast (adjusted from 5-day)
        getWeatherForecast(city);
    } catch (error) {
        displayError('Unable to fetch weather data. Please try again.');
    }
}

// Function to get the 10-day weather forecast
async function getWeatherForecast(city) {
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();

        // Adjust to show the next 10 days (forecast every 3 hours)
        originalForecast = forecastData.list;
        filteredForecast = originalForecast;
        
        displayWeatherForecastTable(filteredForecast);
        initializeCharts(filteredForecast);  // Call the function from chart.js
    } catch (error) {
        displayError('Unable to fetch forecast data.');
    }
}

// Function to display current weather data
function displayCurrentWeather(data) {
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const weatherCondition = document.getElementById('weather-condition');

    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp} °C`;
    humidity.textContent = `${data.main.humidity} %`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    weatherCondition.textContent = data.weather[0].description;

    // Change background based on weather condition
    changeBackground(data.weather[0].main);
}

// Function to display the forecast table with pagination
function displayWeatherForecastTable(forecast) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    // Pagination calculations
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = forecast.slice(startIndex, startIndex + rowsPerPage);

    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temp = `${item.main.temp} °C`;
        const condition = item.weather[0].main;

        row.innerHTML = `
            <td>${date}</td>
            <td>${temp}</td>
            <td>${condition}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update pagination info
    updatePagination(forecast.length);
}

// Function to update pagination buttons and info
function updatePagination(totalItems) {
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalItems / rowsPerPage)}`;

    document.getElementById('prev-page-btn').disabled = currentPage === 1;
    document.getElementById('next-page-btn').disabled = currentPage * rowsPerPage >= totalItems;
}

// Function to handle sorting by temperature
document.getElementById('sort-temp-btn').addEventListener('click', () => {
    filteredForecast.sort((a, b) => sortAscending ? a.main.temp - b.main.temp : b.main.temp - a.main.temp);
    sortAscending = !sortAscending;  // Toggle sort direction
    displayWeatherForecastTable(filteredForecast);
});

// Function to handle pagination buttons
document.getElementById('prev-page-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayWeatherForecastTable(filteredForecast);
    }
});

document.getElementById('next-page-btn').addEventListener('click', () => {
    if (currentPage * rowsPerPage < filteredForecast.length) {
        currentPage++;
        displayWeatherForecastTable(filteredForecast);
    }
});

// Function to handle filtering by weather condition
document.getElementById('filter-btn').addEventListener('click', () => {
    const conditionFilter = document.getElementById('condition-filter').value;
    
    if (conditionFilter) {
        filteredForecast = originalForecast.filter(item => item.weather[0].main === conditionFilter);
    } else {
        // If no filter is applied, show the original forecast data
        filteredForecast = originalForecast;
    }
    
    currentPage = 1;  // Reset to the first page
    displayWeatherForecastTable(filteredForecast);
});

// Function to clear the filter
document.getElementById('clear-filter-btn').addEventListener('click', () => {
    filteredForecast = originalForecast;  // Reset to original data
    currentPage = 1;  // Reset to the first page
    displayWeatherForecastTable(filteredForecast);
});

// Function to change background based on the weather condition
function changeBackground(condition) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (condition.includes('Clouds')) {
        weatherWidget.style.backgroundImage = 'url("cloudy.jpg")';
    } else if (condition.includes('Rain')) {
        weatherWidget.style.backgroundImage = 'url("rainy.jpg")';
    } else if (condition.includes('Clear')) {
        weatherWidget.style.backgroundImage = 'url("clear.jpg")';
    } else {
        weatherWidget.style.backgroundImage = 'url("default.jpg")';
    }
}

// Function to display error messages
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Event listener for the "Get Weather" button
document.getElementById('get-weather-btn').addEventListener('click', function() {
    const cityInput = document.getElementById('city-input').value.trim();

    if (cityInput) {
        document.getElementById('error-message').style.display = 'none'; // Hide error message
        getWeatherData(cityInput);
    } else {
        displayError('Please enter a city name.');
    }
});
