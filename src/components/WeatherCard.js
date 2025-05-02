import React from 'react';

const WeatherCard = ({ data }) => {
  const weatherIcon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  const date = new Date(data.dt * 1000);

  return (
    <div className="forecast-card">
      <h4 className="forecast-day">
        {date.toLocaleDateString('en-US', { weekday: 'short' })}
      </h4>
      <div className="forecast-date">
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
      <img 
        src={iconUrl} 
        alt={data.weather[0].description} 
        className="forecast-icon"
      />
      <div className="forecast-description">
        {data.weather[0].description}
      </div>
      <div className="forecast-temps">
        <span className="forecast-max">
          {Math.round(data.main.temp_max)}°
        </span>
        <span className="forecast-min">
          {Math.round(data.main.temp_min)}°
        </span>
      </div>
    </div>
  );
};

export default WeatherCard;