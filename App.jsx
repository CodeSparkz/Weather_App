import React, { useState, useEffect } from 'react';
import { pakistanCitiesList, interpretWeatherCode } from './utils/pakistanData.js';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(pakistanCitiesList[0]);
  const [liveWeather, setLiveWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Theme Mapper: Automatically computes custom pastel gradients and borders matching the condition
  const getThemeStyles = (condition) => {
    if (!condition) return { wrapper: 'from-[#F8FAFC] to-[#F1F5F9]', card: 'bg-white/70 border-white' };
    
    switch(condition) {
      case 'Clear': 
        return { 
          wrapper: 'from-[#FFFDF4] via-[#FFF3EA] to-[#FFE3D1]', 
          card: 'bg-white/60 border-[#F5E3D7]' 
        };
      case 'Partly Cloudy': 
        return { 
          wrapper: 'from-[#F4F7FA] via-[#E9EFF5] to-[#DCE6F0]', 
          card: 'bg-white/60 border-[#CBD5E1]' 
        };
      case 'Cloudy / Hazy': 
        return { 
          wrapper: 'from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]', 
          card: 'bg-white/50 border-[#94A3B8]/30' 
        };
      case 'Rainy': 
        return { 
          wrapper: 'from-[#EAF4F2] via-[#DBEAE7] to-[#C9DDD9]', 
          card: 'bg-white/60 border-[#CADCD9]' 
        };
      case 'Thunderstorm': 
        return { 
          wrapper: 'from-[#E2E8F0] via-[#D1DCE8] to-[#BACBD9]', 
          card: 'bg-white/50 border-[#A2B6CB]' 
        };
      default: 
        return { 
          wrapper: 'from-[#F3F4F6] to-[#E5E7EB]', 
          card: 'bg-white/60 border-[#D1D5DB]' 
        };
    }
  };

  useEffect(() => {
    async function fetchLiveWeather() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();

        const currentMeta = interpretWeatherCode(data.current.weather_code, data.current.is_day === 0);

        const indices = [6, 9, 12, 15, 18, 21, 0, 3]; 
        const parsedHourly = indices.map(idx => {
          const rawTime = new Date(data.hourly.time[idx]);
          const formattedHour = rawTime.toLocaleString('en-US', { hour: 'numeric', hour12: true });
          const isNightHour = rawTime.getHours() < 6 || rawTime.getHours() > 18;
          const hourlyMeta = interpretWeatherCode(data.hourly.weather_code[idx], isNightHour);

          return {
            time: formattedHour,
            temp: Math.round(data.hourly.temperature_2m[idx]),
            icon: hourlyMeta.icon,
            condition: hourlyMeta.condition
          };
        });

        setLiveWeather({
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          condition: currentMeta.condition,
          icon: currentMeta.icon,
          hourly: parsedHourly
        });
      } catch (err) {
        console.error("Failed to load live tracking stream:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveWeather();
  }, [selectedCity]);

  // Compute active theme parameters based on current weather condition
  const activeTheme = getThemeStyles(liveWeather?.condition);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-6 md:p-12 bg-gradient-to-tr transition-all duration-1000 ${activeTheme.wrapper}`}>
      
      {/* Header Profile Title */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extralight tracking-tight text-[#1E293B]">
            {selectedCity.name} <span className="text-2xl filter drop-shadow-xs">{selectedCity.emoji}</span>
          </h1>
          <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">{selectedCity.region}, Pakistan</p>
        </div>
        <span className="text-xs px-3 py-1 bg-white/40 text-[#334155] border border-black/5 font-medium rounded-full backdrop-blur-md">
          ● Live Satellite Stream
        </span>
      </header>

      {/* Loading Fallback */}
      {loading || !liveWeather ? (
        <div className="flex flex-col items-center justify-center h-64 w-full max-w-4xl bg-white/30 rounded-3xl border border-white/40 backdrop-blur-md">
          <p className="text-xs font-medium tracking-wider text-[#64748B] uppercase animate-pulse">Syncing Regional Sensors...</p>
        </div>
      ) : (
        <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Hero Card displaying dynamic theme styling */}
          <div className={`md:col-span-2 p-8 border backdrop-blur-md rounded-3xl shadow-xs flex flex-col justify-between h-64 transition-all duration-1000 ${activeTheme.card}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-6xl font-extralight text-[#0F172A]">{liveWeather.temp}°C</p>
                <p className="text-sm font-light text-[#475569] mt-2">Currently {liveWeather.condition.toLowerCase()} (Feels like {liveWeather.feelsLike}°C)</p>
              </div>
              <span className="text-7xl filter drop-shadow-xs select-none transition-transform duration-700 hover:scale-110">{liveWeather.icon}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4 text-center">
              <div>
                <p className="text-xs text-[#64748B]">Station Humidity</p>
                <p className="text-sm font-medium mt-0.5 text-[#1E293B]">{liveWeather.humidity}%</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Live Wind Vector</p>
                <p className="text-sm font-medium mt-0.5 text-[#1E293B]">{liveWeather.wind} km/h</p>
              </div>
            </div>
          </div>

          {/* Regional Hub Selector */}
          <div className={`p-6 border backdrop-blur-md rounded-3xl shadow-xs flex flex-col transition-all duration-1000 ${activeTheme.card}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">Track Another Hub</h3>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 pr-1 no-scrollbar">
              {pakistanCitiesList.map((c) => (
                <button 
                  key={c.name}
                  onClick={() => setSelectedCity(c)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs flex justify-between items-center transition-all cursor-pointer ${
                    selectedCity.name === c.name
                      ? 'bg-white text-[#0F172A] font-medium border-black/10 shadow-2xs' 
                      : 'bg-white/20 hover:bg-white/60 text-[#334155] border-transparent'
                  }`}
                >
                  <span>{c.emoji} {c.name}</span>
                  <span className="text-[10px] opacity-40">{c.region}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 24-Hour Day & Night Satellite Timeline */}
          <div className={`md:col-span-3 p-6 border backdrop-blur-md rounded-3xl shadow-xs transition-all duration-1000 ${activeTheme.card}`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-4">True 24-Hour Day & Night Satellite Forecast</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {liveWeather.hourly.map((hour, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[85px] bg-white/60 rounded-2xl py-3 px-2 border border-black/5 shadow-3xs transition-transform duration-300 hover:-translate-y-0.5">
                  <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-tighter">{hour.time}</p>
                  <span className="text-3xl my-2 filter drop-shadow-3xs select-none">{hour.icon}</span>
                  <p className="text-sm font-semibold text-[#1E293B]">{hour.temp}°C</p>
                  <p className="text-[9px] text-[#94A3B8] font-light mt-0.5 truncate max-w-full">{hour.condition}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}
    </div>
  );
}