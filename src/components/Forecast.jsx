export default function Forecast({ daily }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12 animate-slide-up [animation-delay:300ms]">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-5 shadow-xl">
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          5-Day Forecast
        </h3>

        <div className="flex flex-col divide-y divide-white/10">
          {daily.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group">
              <span className="w-20 text-white font-medium text-left">{day.day}</span>
              
              <div className="flex items-center gap-2 w-28 justify-start">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                  alt={day.condition} 
                  className="w-10 h-10 select-none group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xs text-white/60 font-medium hidden sm:inline capitalize">{day.condition.toLowerCase()}</span>
              </div>

              <div className="flex items-center justify-end gap-4 text-right">
                <span className="text-white/40 text-sm font-medium w-8">{Math.round(day.min)}°</span>
                {/* Visual mini-bar visual element slider track indicator */}
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden relative hidden xs:block">
                  <div className="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-teal-400 to-amber-400 rounded-full"></div>
                </div>
                <span className="text-white font-semibold w-8">{Math.round(day.max)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
