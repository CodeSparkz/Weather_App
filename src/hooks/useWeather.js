import { useState, useEffect } from 'react';
import { fetchWeatherData } from "../utils/api.js";

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem('recent_weather_searches');
    return saved ? JSON.parse(saved) : ['London', 'New York', 'Tokyo'];
  });

  const getWeatherData = async (query, isCoords = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(query, isCoords);
      setWeather(data);
      
      if (!isCoords && typeof query === 'string') {
        updateRecents(data.name);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecents = (cityName) => {
    setRecents(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 5);
      localStorage.setItem('recent_weather_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Get user location on initial mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherData({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }, true);
        },
        () => {
          // Fallback if permission denied
          getWeatherData('New York');
        }
      );
    } else {
      getWeatherData('New York');
    }
  }, []);

  return { weather, loading, error, recents, searchCity: (city) => getWeatherData(city), searchCoords: (coords) => getWeatherData(coords, true) };
};
