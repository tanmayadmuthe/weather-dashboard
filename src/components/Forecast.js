import React from 'react';
import WeatherCard from './WeatherCard';
import './Forecast.css';

const Forecast = ({ data }) => {
  const dailyForecast = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const forecastDays = Object.keys(dailyForecast).slice(0, 5).map(date => {
    const middayIndex = Math.floor(dailyForecast[date].length / 2);
    return dailyForecast[date][middayIndex];
  });

  return (
    <div className="forecast-section">
      <h3 className="section-title">
        <i className="wi wi-forecast-io-partly-cloudy-day"></i> 5-Day Forecast
      </h3>
      <div className="forecast-cards">
        {forecastDays.map((day, index) => (
          <WeatherCard key={index} data={day} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;