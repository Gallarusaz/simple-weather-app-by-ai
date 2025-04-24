# WeatherNow

A simple, responsive weather application that displays current weather conditions for any city using the OpenWeatherMap API.

## Features

- Search for weather by city name
- Display current temperature, weather description, and icon
- Toggle between Celsius and Fahrenheit
- Weather-based clothing advice
- Responsive design for all devices
- Loading spinner for better UX

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling for the application
- `script.js` - JavaScript functionality and API interaction

## How to Use

1. Clone or download this repository
2. Get an API key from [OpenWeatherMap](https://openweathermap.org/api) (free tier is sufficient)
3. Open `script.js` in a text editor
4. Replace the API_KEY value with your actual API key
5. Open `index.html` in a web browser

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external libraries or frameworks required
- Fetches data from OpenWeatherMap API
- Responsive design with CSS media queries
- Uses CSS variables for consistent styling

## API Information

This app uses the OpenWeatherMap API, specifically the `/weather` endpoint:
```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

You need to sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api).

## License

MIT 