import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, onLocationSearch, recents }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-50 mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a city..."
            className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-md text-white placeholder-white/60 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-lg text-lg"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={onLocationSearch}
          className="p-3.5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all shadow-lg active:scale-95"
          title="Use current location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </button>
      </form>

      {showDropdown && recents.length > 0 && (
        <div ref={dropdownRef} className="absolute w-full mt-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Recent Searches</div>
          <ul>
            {recents.map((city, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    onSearch(city);
                    setShowDropdown(false);
                  }}
                  className="w-full px-5 py-3 text-left text-white/80 hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{city}</span>
                  <span className="text-white/30 text-sm">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
