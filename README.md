# myCityWeather 🌤️

A beautiful and responsive weather application that provides real-time weather information for cities worldwide. Built with modern web technologies and featuring a clean, intuitive interface.

## Features ✨

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **Interactive Map**: Visualize city locations with integrated OpenStreetMap
- **Search History**: Quick access to recently searched cities
- **Popular Cities**: One-click access to weather information for major global cities
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- **Responsive Design**: Optimized for all devices - mobile, tablet, and desktop
- **Local Time Display**: Shows local time for searched cities

## Technologies Used 🛠️

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- Vite (Build tool)
- OpenWeatherMap API (Weather data)
- Leaflet.js (Interactive maps)
- Font Awesome (Icons)

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenWeatherMap API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/mycityweather.git
   ```

2. Navigate to the project directory
   ```bash
   cd mycityweather
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### Building for Production

To create a production build:
```bash
npm run build
```

## Features in Detail 🔍

### Weather Information
- Current temperature
- Weather description
- Humidity levels
- Wind speed
- Atmospheric pressure

### Interactive Map
- Automatically centers on searched city
- Marker indicates exact location
- Smooth animations for location changes

### Theme Toggle
- Light theme for daytime use
- Dark theme for comfortable nighttime viewing
- Persistent theme selection

### Search Functionality
- Auto-complete suggestions
- Recent searches history
- One-click search from history

## Contributing 🤝

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- OpenWeatherMap for providing weather data
- OpenStreetMap contributors for map data
- Font Awesome for the beautiful icons