import React from 'react';
import './WeatherIcons.css'; // New file for weather icons

const CurrentWeather = ({ data, locationMethod, locationAccuracy }) => {
  const weatherIcon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@4x.png`;
  
  const getLocationMethodIcon = () => {
    const icons = {
      GPS: 'wi wi-gps',
      Network: 'wi wi-wifi',
      Manual: 'wi wi-search',
      Default: 'wi wi-earth'
    };
    return icons[locationMethod] || 'wi wi-earth';
  };

  return (
    <div className="current-weather-card">
      <div className="location-info">
        <div className="location-header">
          <h2>
            <i className="wi wi-location"></i> 
            {data.name}, {data.sys.country}
          </h2>
          <p className="date">
            {new Date(data.dt * 1000).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="location-meta">
          <span className="location-method">
            <i className={getLocationMethodIcon()}></i> {locationMethod}
          </span>
          {locationAccuracy && (
            <span className="location-accuracy">
              <i className="wi wi-accuracy"></i> {locationAccuracy}
            </span>
          )}
        </div>
      </div>
      
      <div className="weather-display">
        <div className="temperature-section">
          <img 
            src={iconUrl} 
            alt={data.weather[0].description} 
            className="weather-icon"
          />
          <div className="temperature-value">
            {Math.round(data.main.temp)}°C
          </div>
          <div className="weather-description">
            {data.weather[0].description}
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <i className="wi wi-thermometer"></i>
            <span>Feels like</span>
            <strong>{Math.round(data.main.feels_like)}°C</strong>
          </div>
          
          <div className="detail-item">
            <i className="wi wi-humidity"></i>
            <span>Humidity</span>
            <strong>{data.main.humidity}%</strong>
          </div>
          
          <div className="detail-item">
            <i className="wi wi-strong-wind"></i>
            <span>Wind</span>
            <strong>{Math.round(data.wind.speed * 3.6)} km/h</strong>
          </div>
          
          <div className="detail-item">
            <i className="wi wi-barometer"></i>
            <span>Pressure</span>
            <strong>{data.main.pressure} hPa</strong>
          </div>
          
          <div className="detail-item">
            <i className="wi wi-visibility"></i>
            <span>Visibility</span>
            <strong>{(data.visibility / 1000).toFixed(1)} km</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;