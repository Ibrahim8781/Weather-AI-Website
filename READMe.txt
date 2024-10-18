Web Engineering
Assignment 2
SE-3003-WEB ENGINEERING 
by
Ibrahim Ahmad 22i-8781
Assignment 2
Submitted to Sir Zaheer Sani
Date: 18th October, 2024
________________
Weather Forecast and Chatbot Application
Project Overview
This project is a Weather Forecast and Chatbot Application that allows users to:

Fetch and Display Current Weather :

Users can enter a city name, and the application will fetch and display the current weather data (temperature, humidity, wind speed, etc.) for that location using the OpenWeather API.

5-Day Weather Forecast:


The app also provides a detailed 5-day weather forecast, displayed in a paginated table format with options to filter by rainy days, sort by temperature, and view the day with the highest temperature.


Chatbot Interaction 


A chatbot is integrated into the app, which allows users to ask weather-related or general questions. The bot can understand weather-related queries (e.g., "What's the weather in Lahore?") and respond with current weather information. For non-weather queries, the chatbot responds using the Gemini API for text generation.


Chart Display


A display of temperature and weather with the help of Doughnut, Line and Bar chart using chart.js and different CSS implementations
________________
Technologies Used:


* HTML/CSS/JavaScript: Frontend development and UI.
* JQuery: Responsiveness
* OpenWeather API: For fetching current weather and 5-day forecast data.
* Gemini API: For chatbot functionality and generating human-like responses.
* Fetch API: For making asynchronous HTTP requests to external APIs.


How to Run the Project: 


Clone the Repository:

Clone the project repository to your local machine using Git (or simply download the files).
Bash
Repository Code

https://github.com/Ibrahim8781/Weather-AI-Website.git
cd Weather-AI-Website
	

Set Your  API keys:

Obtain your Google API key from 
https://aistudio.google.com/app/apikey
	

        And Open Weather API from 
https://home.openweather.co.uk/api_keys
	

Open the script.js file and replace the placeholder API keys with your own:

const OPENWEATHER_API_KEY = 'your-openweather-api-key';
const GEMINI_API_KEY = 'your-gemini-api-key';
	

Start a Local Web Server on Browser:

Set your browser (Chrome Firefox Edge ) in working condition 
Open Project with Visual Studio Code
Open YOur project or import your project in VS code 
Install extension Live Server
Run project index.html with live server and you can now enjoy


I228781