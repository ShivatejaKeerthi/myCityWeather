const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const weatherIcon = document.getElementById('weatherIcon');
const themeToggle = document.getElementById('themeToggle');
const recentSearches = document.getElementById('recentSearches');
const searchSuggestions = document.getElementById('searchSuggestions');
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const weatherCard = document.querySelector('.weather-card');
const logo = document.querySelector('.logo');
const homeLink = document.querySelector('a[href="#home"]');

let map;
let marker;

// Initialize map
function initMap() {
  map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

// Update map location
function updateMap(lat, lon) {
  if (!map) {
    initMap();
  }
  
  map.setView([lat, lon], 13);
  
  if (marker) {
    marker.remove();
  }
  
  marker = L.marker([lat, lon]).addTo(map);
}

// Format city time based on timezone offset
function formatCityTime(timestamp, timezoneOffset) {
  const cityDate = new Date((timestamp + timezoneOffset) * 1000);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  };
  return cityDate.toLocaleString('en-US', options);
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Search suggestions
let timeoutId;
async function handleSearchInput(e) {
  const query = e.target.value.trim();
  
  clearTimeout(timeoutId);
  
  if (query.length < 3) {
    searchSuggestions.classList.remove('active');
    return;
  }
  
  timeoutId = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const suggestions = data.map(city => `
          <div class="suggestion-item" onclick="searchCity('${city.name}, ${city.country}')">
            ${city.name}, ${city.country}
          </div>
        `).join('');
        
        searchSuggestions.innerHTML = suggestions;
        searchSuggestions.classList.add('active');
      } else {
        searchSuggestions.classList.remove('active');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);
}

// Recent searches management
function addToRecentSearches(city) {
  let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase());
  recent.unshift(city);
  recent = recent.slice(0, 5);
  
  localStorage.setItem('recentSearches', JSON.stringify(recent));
  updateRecentSearchesUI();
}

function updateRecentSearchesUI() {
  const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  recentSearches.innerHTML = recent
    .map(city => `
      <div class="recent-chip" onclick="searchCity('${city}')">
        ${city}
      </div>
    `)
    .join('');
}

// Weather icon mapping
function getWeatherIcon(iconCode) {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-sun-rain',
    '10n': 'cloud-moon-rain',
    '11d': 'bolt',
    '11n': 'bolt',
    '13d': 'snowflake',
    '13n': 'snowflake',
    '50d': 'smog',
    '50n': 'smog'
  };

  return iconMap[iconCode] || 'cloud';
}

function scrollToWeather() {
  weatherCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateWeatherUI(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  pressure.textContent = `${data.main.pressure} hPa`;
  
  const iconName = getWeatherIcon(data.weather[0].icon);
  weatherIcon.className = `fas fa-${iconName}`;
  
  dateTime.textContent = formatCityTime(data.dt, data.timezone);
  updateMap(data.coord.lat, data.coord.lon);
  
  // Scroll to weather card after updating UI
  scrollToWeather();
}

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

async function handleSearch() {
  const city = cityInput.value.trim();
  if (city) {
    const weatherCard = document.querySelector('.weather-card');
    weatherCard.classList.add('loading');
    searchSuggestions.classList.remove('active');
    
    try {
      const weatherData = await getWeatherData(city);
      updateWeatherUI(weatherData);
      addToRecentSearches(city);
    } catch (error) {
      alert('Could not find weather data for this city. Please try another one.');
    } finally {
      weatherCard.classList.remove('loading');
    }
  }
}

// Popular cities
async function updatePopularCities() {
  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Sydney', 'Mumbai'];
  
  for (const city of popularCities) {
    try {
      const data = await getWeatherData(city);
      const cityElement = document.querySelector(`[data-city="${city}"] div`);
      if (cityElement) {
        cityElement.textContent = `${Math.round(data.main.temp)}°C`;
      }
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
    }
  }
}

// Mobile menu toggle
function toggleMenu() {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
}

// Make searchCity function available globally
window.searchCity = function(city) {
  cityInput.value = city;
  handleSearch();
};

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
cityInput.addEventListener('input', handleSearchInput);
cityInput.addEventListener('blur', () => {
  setTimeout(() => {
    searchSuggestions.classList.remove('active');
  }, 200);
});
themeToggle.addEventListener('click', toggleTheme);
hamburger.addEventListener('click', toggleMenu);

// Add click event listeners for logo and home link
logo.addEventListener('click', scrollToWeather);
logo.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    scrollToWeather();
  }
});
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  scrollToWeather();
});

document.querySelectorAll('.city-card').forEach(card => {
  card.addEventListener('click', () => {
    const city = card.getAttribute('data-city');
    searchCity(city);
  });
});

// Initialize
initTheme();
updateRecentSearchesUI();
initMap();
updatePopularCities();

// Initialize with default city
cityInput.value = 'London';
handleSearch();