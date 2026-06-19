export default function HourlyForecast({ hourly }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-slide-up [animation-delay:150ms]">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-5 shadow-xl">
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hourly Forecast
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
          {hourly.map((hour, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-20 flex flex-col items-center py-3 bg-white/5 rounded-2xl border border-white/5 snap-center hover:bg-white/10 transition-colors"
            >
              <span className="text-xs text-white/70 font-medium">{hour.time}</span>
              <img 
                src={`https://openweathermap.org/img/wn/${hour.icon}.png`} 
                alt={hour.condition} 
                className="w-10 h-10 my-1 select-none"
              />
              <span className="text-lg font-semibold text-white">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
