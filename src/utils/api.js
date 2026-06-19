const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherTheme = (condition) => {
  if (!condition) return 'bg-gradient-to-br from-blue-600 to-indigo-900';
  const main = condition.toLowerCase();
  if (main.includes('clear')) return 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600';
  if (main.includes('cloud')) return 'bg-gradient-to-br from-slate-400 via-blue-900 to-slate-800';
  if (main.includes('rain') || main.includes('drizzle')) return 'bg-gradient-to-br from-cyan-900 via-blue-950 to-slate-900';
  if (main.includes('thunderstorm')) return 'bg-gradient-to-br from-purple-950 via-slate-900 to-black';
  if (main.includes('snow')) return 'bg-gradient-to-br from-sky-300 via-blue-500 to-slate-100';
  return 'bg-gradient-to-br from-blue-500 to-indigo-800';
};

export const fetchWeatherData = async (query, isCoords = false) => {
  const endpoint = isCoords 
    ? `lat=${query.lat}&lon=${query.lon}`
    : `q=${encodeURIComponent(query)}`;

  // 1. Fetch Current Weather
  const currentRes = await fetch(`${BASE_URL}/weather?${endpoint}&units=metric&appid=${API_KEY}`);
  if (!currentRes.ok) throw new Error('City not found. Check spelling and try again.');
  const currentData = await currentRes.json();

  // 2. Fetch 5-Day / 3-Hour Forecast
  const forecastRes = await fetch(`${BASE_URL}/forecast?${endpoint}&units=metric&appid=${API_KEY}`);
  if (!forecastRes.ok) throw new Error('Failed to fetch forecast data.');
  const forecastData = await forecastRes.json();

  // Process Hourly Forecast (Next 6 slots / 18 hours)
  const hourly = forecastData.list.slice(0, 6).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    condition: item.weather[0].main
  }));

  // Process 5-Day Forecast (Grouping by unique calendar days)
  const dailyMap = {};
  forecastData.list.forEach(item => {
    const dateStr = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        day: dateStr,
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        condition: item.weather[0].main
      };
    } else {
      if (item.main.temp_min < dailyMap[dateStr].min) dailyMap[dateStr].min = item.main.temp_min;
      if (item.main.temp_max > dailyMap[dateStr].max) dailyMap[dateStr].max = item.main.temp_max;
    }
  });

  return {
    current: {
      name: currentData.name,
      country: currentData.sys.country,
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      pressure: currentData.main.pressure,
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      timezone: currentData.timezone,
    },
    hourly,
    daily: Object.values(dailyMap).slice(0, 5) // Extract exactly 5 days
  };
};
