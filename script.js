
const OPENWEATHER_API_KEY = 'a2ad1333887912dca2b683a515663cdd';
const GEMINI_API_KEY = 'AIzaSyDHU5XuZ383uUgsARx54iVqTSyzCRLoIc4'; 

let currentPage = 1;
const rowsPerPage = 10;
let originalForecast = [];
let filteredForecast = [];
let sortAscending = true;

let latestWeatherData = null;

// current weather data 
async function getWeatherData(city) {
    try {
        const encodedCity = encodeURIComponent(city);
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error(`HTTP error! status: ${weatherResponse.status}`);
        }
        
        const weatherData = await weatherResponse.json();

        latestWeatherData = weatherData;
        displayCurrentWeather(weatherData);
        getWeatherForecast(city);
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError(`Unable to fetch weather data for ${city}. Please try again.`);
        return null;
    }
}

// 5-day weather forecast
async function getWeatherForecast(city) {
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        
        if (!forecastResponse.ok) {
            throw new Error(`HTTP error! status: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
            throw new Error(`API error: ${forecastData.message}`);
        }

        originalForecast = forecastData.list;
        filteredForecast = originalForecast;
        
        if (window.location.pathname.includes('table.html')) {
            displayWeatherForecastTable(filteredForecast);
        } else if (typeof initializeCharts === 'function') {
            initializeCharts(filteredForecast);
            const chartsContainer = document.getElementById('charts-container');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        displayError(`Unable to fetch forecast data: ${error.message}`);
    }
}

// Function to display current weather data
function displayCurrentWeather(data) {
    const weatherWidget = document.getElementById('weather-widget');
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const weatherCondition = document.getElementById('weather-condition');

    if (weatherWidget && cityName && temperature && humidity && windSpeed && weatherCondition) {
        cityName.textContent = data.name;
        temperature.textContent = `${data.main.temp.toFixed(1)} °C`;
        humidity.textContent = `${data.main.humidity}%`;
        windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
        weatherCondition.textContent = data.weather[0].description;

        const condition = data.weather[0].main.toLowerCase();
        weatherWidget.style.backgroundImage = `url('images/${condition}.jpg')`;
        
        weatherWidget.style.backgroundImage = `url('images/${condition}.jpg')`;
        weatherWidget.style.backgroundSize = 'cover';
        weatherWidget.style.backgroundPosition = 'center';
        
        weatherWidget.style.backgroundColor = '#f0f0f0';
        
        console.log(`Attempting to load image: images/${condition}.jpg`);
    }
}

function displayWeatherForecastTable(forecast) {
    const tableBody = document.getElementById('forecast-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = forecast.slice(startIndex, startIndex + rowsPerPage);

    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temp = `${item.main.temp.toFixed(1)} °C`;
        const condition = item.weather[0].main;

        row.innerHTML = `
            <td>${date}</td>
            <td>${temp}</td>
            <td>${condition}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination(forecast.length);
}

// pagination 
function updatePagination(totalItems) {
    const pageInfo = document.getElementById('page-info');
    if (!pageInfo) return;

    const totalPages = Math.ceil(totalItems / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    if (prevButton) prevButton.disabled = currentPage === 1;
    if (nextButton) nextButton.disabled = currentPage === totalPages;
}

// sorting by temperature
function sortByTemperature(ascending = true) {
    filteredForecast.sort((a, b) => {
        return ascending ? a.main.temp - b.main.temp : b.main.temp - a.main.temp;
    });
    currentPage = 1;
    displayWeatherForecastTable(filteredForecast);
}

// filter rainy days
function filterRainyDays() {
    filteredForecast = originalForecast.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
    currentPage = 1;
    displayWeatherForecastTable(filteredForecast);
}

// day with highest temperature
function showHighestTempDay() {
    const highestTempDay = originalForecast.reduce((prev, current) => {
        return (prev.main.temp > current.main.temp) ? prev : current;
    });
    filteredForecast = [highestTempDay];
    currentPage = 1;
    displayWeatherForecastTable(filteredForecast);
}

// clear all filters
function clearFilters() {
    filteredForecast = originalForecast;
    currentPage = 1;
    displayWeatherForecastTable(filteredForecast);
}

// Event listeners for table.html
function initTableEventListeners() {
    const sortTempAsc = document.getElementById('sort-temp-asc');
    const sortTempDesc = document.getElementById('sort-temp-desc');
    const filterRain = document.getElementById('filter-rain');
    const showHighestTemp = document.getElementById('show-highest-temp');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');

    if (sortTempAsc) sortTempAsc.addEventListener('click', () => sortByTemperature(true));
    if (sortTempDesc) sortTempDesc.addEventListener('click', () => sortByTemperature(false));
    if (filterRain) filterRain.addEventListener('click', filterRainyDays);
    if (showHighestTemp) showHighestTemp.addEventListener('click', showHighestTempDay);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    if (prevPage) prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayWeatherForecastTable(filteredForecast);
        }
    });
    if (nextPage) nextPage.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredForecast.length / rowsPerPage)) {
            currentPage++;
            displayWeatherForecastTable(filteredForecast);
        }
    });
}


function initGetWeatherButton() {
    const getWeatherBtn = document.getElementById('get-weather-btn');
    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', function() {
            const cityInput = document.getElementById('city-input');
            if (cityInput && cityInput.value.trim()) {
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) errorMessage.style.display = 'none';
                getWeatherData(cityInput.value.trim());
            } else {
                displayError('Please enter a city name.');
            }
        });
    }
}

// Chatbot 
async function handleUserQuery(query) {
    displayUserQuery(query);
    
    if (isWeatherQuery(query)) {
        const city = extractCityFromQuery(query);
        if (city) {
            const weatherData = await getWeatherData(city);
            if (weatherData) {
                const weatherPrompt = `Provide a weather summary for ${city}. The current temperature is ${weatherData.main.temp}°C, humidity is ${weatherData.main.humidity}%, wind speed is ${weatherData.wind.speed} m/s, and the weather condition is ${weatherData.weather[0].description}.`;
                const geminiResponse = await getGeminiResponse(weatherPrompt);
                displayChatbotResponse(geminiResponse);
            }
        } else {
            displayChatbotResponse("I'm sorry, I couldn't determine which city you're asking about. Can you please specify the city name?");
        }
    } else {
        const geminiResponse = await getGeminiResponse(query);
        displayChatbotResponse(geminiResponse);
    }
}

function isWeatherQuery(query) {
    return query.toLowerCase().includes("weather");
}

function extractCityFromQuery(query) {
    const cleanedQuery = query.toLowerCase()
        .replace(/weather|in|at|for|today/g, '')
        .trim();
    
    if (cleanedQuery) {
        return cleanedQuery;
    }
    
    return null;
}

async function getGeminiResponse(query) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: query }]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text || "Sorry, I couldn't process that.";
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "Error generating a response.";
    }
}

function displayUserQuery(query) {
    const chatbox = document.getElementById('chatbox');
    if (!chatbox) return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = query;
    chatbox.appendChild(userMessage);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function displayChatbotResponse(response) {
    const chatbox = document.getElementById('chatbox');
    if (!chatbox) return;

    const botMessage = document.createElement('div');
    botMessage.classList.add('bot-message');
    botMessage.textContent = response;
    chatbox.appendChild(botMessage);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// chatbot input form
function initChatbotForm() {
    const chatbotForm = document.getElementById('chatbot-input');
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userInput = document.getElementById('user-query');
            if (userInput) {
                const query = userInput.value.trim();
                if (query) {
                    await handleUserQuery(query);
                    userInput.value = '';
                }
            }
        });
    }
}

// Function to display error messages
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        console.error('Error element not found in the DOM');
        alert(message);
    }
}

// Initialize all event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initTableEventListeners();
    initGetWeatherButton();
    initChatbotForm();
});