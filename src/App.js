import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import './App.css';
import './components/WeatherIcons.css';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const IPAPI_KEY = process.env.REACT_APP_IPAPI_KEY;
const DEFAULT_LOCATION = process.env.REACT_APP_DEFAULT_LOCATION || 'London';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationMethod, setLocationMethod] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  const fetchWeatherData = async (loc) => {
    try {
      setLoading(true);
      setError(null);
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${API_KEY}&units=metric`)
      ]);
      
      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setLocationMethod('Manual');
      setLocationAccuracy('Exact location');
    } catch (err) {
      setError('Location not found. Please try another city.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon, accuracy) => {
    try {
      setLoading(true);
      setError(null);
      
      const reverseGeo = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      
      const locationName = reverseGeo.data[0]?.name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);
      
      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setLocationAccuracy(accuracy ? `±${Math.round(accuracy)} meters` : 'High accuracy');
      setLocationMethod('GPS');
    } catch (err) {
      console.error('Error fetching weather by coordinates:', err);
      setError('Precise location failed. Trying approximate location...');
      fetchApproximateLocation();
    } finally {
      setLoading(false);
    }
  };

  const fetchApproximateLocation = async () => {
    try {
      const ipResponse = await axios.get(`http://api.ipapi.com/api/check?access_key=${IPAPI_KEY}`);
      const { latitude, longitude } = ipResponse.data;
      
      if (latitude && longitude) {
        setLocationMethod('Network');
        setLocationAccuracy('Approximate (IP-based)');
        fetchWeatherByCoords(latitude, longitude, 5000);
      } else {
        throw new Error('IP location failed');
      }
    } catch (err) {
      console.error('IP location error:', err);
      setError('Could not determine your location. Using default location.');
      fetchWeatherData(DEFAULT_LOCATION);
      setLocationMethod('Default');
      setLocationAccuracy('Not available');
    }
    setGeoLoading(false);
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        const geoOptions = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            fetchWeatherByCoords(latitude, longitude, accuracy);
            setGeoLoading(false);
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('High-precision location unavailable. Trying approximate location...');
            fetchApproximateLocation();
          },
          geoOptions
        );
      } else {
        setError('Geolocation not supported. Trying approximate location...');
        fetchApproximateLocation();
      }
    };

    getCurrentLocation();
  }, []);

  const handleSearch = (searchLocation) => {
    setLocationMethod('Manual');
    setLocationAccuracy('Exact location');
    fetchWeatherData(searchLocation);
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    
    const temp = weatherData.main.temp;
    
    if (temp < 0) return 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)';
    if (temp < 10) return 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)';
    if (temp < 20) return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    if (temp < 30) return 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)';
    return 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
  };

  return (
    <div 
      className="app" 
      style={{ background: getBackgroundGradient() }}
    >
      <div className="container">
        <header className="header">
          <h1 className="title">
            <i className="wi wi-day-sunny"></i> WeatherSphere
          </h1>
          <SearchBar onSearch={handleSearch} />
        </header>
        
        {(loading || geoLoading) && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{geoLoading ? 'Detecting your precise location...' : 'Loading weather data...'}</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <i className="wi wi-alien"></i>
            <p>{error}</p>
          </div>
        )}
        
        {weatherData && !loading && !geoLoading && (
          <main className="main-content">
            <CurrentWeather 
              data={weatherData} 
              locationMethod={locationMethod}
              locationAccuracy={locationAccuracy}
            />
            <Forecast data={forecastData} />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;