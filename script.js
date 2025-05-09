// Constants
const API_KEY = '52271b3189365a01612f4b7264d6499e'; // Your API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/alpha/';

// DOM Elements
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const weatherContainer = document.querySelector('.weather-container');
const weatherIcon = document.querySelector('.weather-icon');
const cityName = document.querySelector('.city-name');
const countryName = document.querySelector('.country-name');
const dateTime = document.querySelector('.date-time');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const tempButtons = document.querySelectorAll('.temp-button');
const aiAdvice = document.querySelector('.ai-advice');
const humidityValue = document.querySelector('.humidity-value');
const windValue = document.querySelector('.wind-value');
const errorMessage = document.querySelector('.error-message');
const spinner = document.querySelector('.spinner');

// Variables
let currentTempInKelvin = 0;
let currentTempUnit = 'celsius';
let countryCache = {}; // Cache for country data

// Event Listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
});

tempButtons.forEach(button => {
    button.addEventListener('click', handleTempUnitToggle);
});

// Functions
function handleSearch() {
    const city = searchInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    // Show loading spinner, hide previous results
    showSpinner();
    hideError();
    hideWeatherContainer();

    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const data = await response.json();
        await displayWeatherData(data);
    } catch (error) {
        showError(error.message === 'city not found' 
            ? 'City not found. Please check the spelling and try again.' 
            : 'Something went wrong. Please try again later.');
        console.error('Error fetching weather data:', error);
    } finally {
        hideSpinner();
    }
}

async function displayWeatherData(data) {
    // Store temperature value for unit conversion
    currentTempInKelvin = data.main.temp + 273.15;

    // Set city name
    cityName.textContent = data.name;
    
    // Get and set full country name using REST Countries API
    const countryCode = data.sys.country;
    await setCountryName(countryCode);

    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Set weather description
    description.textContent = data.weather[0].description;

    // Set date and time in the specified format
    setLocalDateTime();

    // Set temperature based on current unit
    updateTemperatureDisplay();

    // Generate and set AI advice
    aiAdvice.textContent = generateWeatherAdvice(data.main.temp, data.weather[0].main);

    // Set humidity and wind values
    humidityValue.textContent = `${data.main.humidity}%`;
    windValue.textContent = `${data.wind.speed} m/s`;

    // Show weather container
    showWeatherContainer();
}

async function setCountryName(countryCode) {
    // Check if we have this country in the cache
    if (countryCache[countryCode]) {
        countryName.textContent = countryCache[countryCode];
        return;
    }

    try {
        // Fetch country data from REST Countries API
        const response = await fetch(`${COUNTRIES_API_URL}${countryCode}`);
        
        if (response.ok) {
            const countryData = await response.json();
            const fullCountryName = countryData[0].name.common;
            
            // Update the DOM
            countryName.textContent = fullCountryName;
            
            // Save to cache
            countryCache[countryCode] = fullCountryName;
        } else {
            // Fallback to country code if API call fails
            countryName.textContent = countryCode;
        }
    } catch (error) {
        // Fallback to country code
        countryName.textContent = countryCode;
        console.error('Error fetching country data:', error);
    }
}

function setLocalDateTime() {
    const now = new Date();
    
    // Format: Month, day, day of week, time (HH:MM)
    const options = { 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    
    dateTime.textContent = now.toLocaleDateString('en-US', options);
}

function updateTemperatureDisplay() {
    let temp;
    let unit;

    if (currentTempUnit === 'celsius') {
        temp = Math.round(currentTempInKelvin - 273.15);
        unit = '°C';
    } else {
        temp = Math.round((currentTempInKelvin - 273.15) * 9/5 + 32);
        unit = '°F';
    }

    // Add plus sign for positive temperatures
    const sign = temp > 0 ? '+' : '';
    temperature.textContent = `${sign}${temp}${unit}`;
}

function handleTempUnitToggle(e) {
    const selectedUnit = e.target.dataset.temp;
    
    if (selectedUnit === currentTempUnit) return;

    // Update active state
    tempButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.temp === selectedUnit);
    });

    // Update current unit and display
    currentTempUnit = selectedUnit;
    updateTemperatureDisplay();
}

function generateWeatherAdvice(tempC, weatherMain) {
    // Simple advice based on temperature and weather
    if (tempC < 0) {
        return 'Wear a heavy coat, gloves, and a hat.';
    } else if (tempC < 10) {
        return 'Wear a warm jacket and consider a hat.';
    } else if (tempC < 20) {
        return 'A light jacket or sweater should be enough.';
    } else if (tempC < 30) {
        return 'Great weather! Short sleeves should be fine.';
    } else {
        return 'It\'s hot! Wear light clothing and stay hydrated.';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showSpinner() {
    spinner.style.display = 'block';
}

function hideSpinner() {
    spinner.style.display = 'none';
}

function showWeatherContainer() {
    weatherContainer.classList.add('visible');
}

function hideWeatherContainer() {
    weatherContainer.classList.remove('visible');
}

// Initialize the app with a default city (optional)
// Uncomment the line below to load a default city when the page loads
// fetchWeatherData('London'); 