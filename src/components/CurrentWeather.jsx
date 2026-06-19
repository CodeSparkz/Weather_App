import { useState, useEffect } from 'react';

export default function CurrentWeather({ current }) {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      // Calculate UTC time, then apply target city timezone offset
      const d = new Date();
      const localUtc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const targetTime = new Date(localUtc + (1000 * current.timezone));
      
      setLocalTime(targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [current.timezone]);

  return (
    <div className="w-full text-white text-center mb-10 animate-slide-up">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight filter drop-shadow-sm">
        {current.name}, <span className="text-white/70 font-medium">{current.country}</span>
      </h1>
      <p className="text-md mt-1 tracking-widest text-white/70 uppercase font-medium">{localTime || 'Calculating...'}</p>
      
      <div className="my-6 flex items-center justify-center gap-2">
        <img 
          src={`https://openweathermap.org/img/wn/${current.icon}@4x.png`} 
          alt={current.condition}
          className="w-28 h-28 object-contain select-none drop-shadow-md animate-pulse"
        />
        <div className="flex flex-col items-start">
          <span className="text-7xl md:text-8xl font-light tracking-tighter relative">
            {current.temp}<span className="text-4xl md:text-5xl absolute -top-2 -right-6 font-light">°</span>
          </span>
          <span className="text-xl md:text-2xl font-medium capitalize mt-1 tracking-wide text-white/90">
            {current.description}
          </span>
        </div>
      </div>

      {/* Grid Details Metrics Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4 mt-8">
        {[
          { label: 'Feels Like', value: `${current.feelsLike}°`, icon: '🌡️' },
          { label: 'Humidity', value: `${current.humidity}%`, icon: '💧' },
          { label: 'Wind Speed', value: `${current.windSpeed} m/s`, icon: '💨' },
          { label: 'Pressure', value: `${current.pressure} hPa`, icon: '🧭' }
        ].map((item, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-md hover:bg-white/15 transition-all group duration-300">
            <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            <span className="block text-white/50 text-xs font-semibold uppercase tracking-wider">{item.label}</span>
            <span className="block text-white text-xl font-bold mt-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
