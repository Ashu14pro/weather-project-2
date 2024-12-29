// Your OpenWeatherMap API Key
const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your actual API key

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const cityNameElem = document.getElementById('city-name');
const temperatureElem = document.getElementById('temperature');
const windElem = document.getElementById('wind');
const humidityElem = document.getElementById('humidity');
const weatherIconElem = document.getElementById('weather-icon');
const forecastElem = document.getElementById('forecast');

// Fetch coordinates using city name
async function getCoordinates(city) {
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await fetch(geoUrl);
    if (!response.ok) return null;
    const data = await response.json();
    return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
  } catch (error) {
    console.error("Failed to fetch coordinates:", error);
    return null;
  }
}

// Fetch weather data using coordinates  (latitude and longitude) ---> (lat, lon)
async function fetchWeather(lat, lon)  {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(weatherUrl);
    if (!response.ok) return;
    const data = await response.json();
    updateCurrentWeather(data.city, data.list[0]);
    updateForecast(data.list);
    weatherContainer.classList.remove('hidden');
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

// Update current weather
function updateCurrentWeather(cityData, weatherData) {
  cityNameElem.textContent = cityData.name;
  temperatureElem.textContent = weatherData.main.temp.toFixed(1);
  windElem.textContent = weatherData.wind.speed;
  humidityElem.textContent = weatherData.main.humidity;
  const iconCode = weatherData.weather[0].icon;
  weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Update 5-day forecast
function updateForecast(forecastData) {
  forecastElem.innerHTML = '';
  const dailyData = forecastData.filter(item => item.dt_txt.includes('12:00:00'));
  dailyData.forEach(day => {
    const date = day.dt_txt.split(' ')[0];
    const temp = day.main.temp.toFixed(1);
    const wind = day.wind.speed;
    const humidity = day.main.humidity;
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const card = document.createElement('div');
    card.classList.add('p-4', 'bg-gray-700', 'text-white', 'rounded-lg', 'w-48', 'flex', 'flex-col', 'items-center', 'transition', 'hover:bg-blue-600');
    card.innerHTML = `
      <h3 class="text-lg">${date}</h3>
      <img src="${icon}" alt="Weather Icon" class="w-12 h-12 my-2">
      <p>Temp: ${temp}°C</p>
      <p>Wind: ${wind} M/S</p>
      <p>Humidity: ${humidity}%</p>
    `;
    forecastElem.appendChild(card);
  });
}

// Event listeners
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  const coordinates = await getCoordinates(city);
  if (coordinates) fetchWeather(coordinates.lat, coordinates.lon);
});

currentLocationBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    (position) => fetchWeather(position.coords.latitude, position.coords.longitude)
  );
});
