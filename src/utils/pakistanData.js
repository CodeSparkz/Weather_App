// Actual coordinates to feed the Live API fetcher
export const pakistanCitiesList = [
  { name: "Lahore", region: "Punjab", emoji: "🕌", lat: 31.5204, lon: 74.3587 },
  { name: "Karachi", region: "Sindh", emoji: "🌊", lat: 24.8607, lon: 67.0011 },
  { name: "Islamabad", region: "Capital Territory", emoji: "⛰️", lat: 33.6844, lon: 73.0479 },
  { name: "Peshawar", region: "KPK", emoji: "🍇", lat: 34.0151, lon: 71.5249 },
  { name: "Quetta", region: "Balochistan", emoji: "🍏", lat: 30.1798, lon: 66.9750 },
  { name: "Multan", region: "Punjab", emoji: "🏺", lat: 30.1575, lon: 71.5249 }
];

// Map open-meteo WMO codes to clean condition strings and matching asset icons
export const interpretWeatherCode = (code, isNight = false) => {
  if ([0].includes(code)) return { condition: "Clear", icon: isNight ? "🌙" : "☀️" };
  if ([1, 2, 3].includes(code)) return { condition: "Partly Cloudy", icon: isNight ? "☁️" : "⛅" };
  if ([45, 48, 51, 53, 55].includes(code)) return { condition: "Cloudy / Hazy", icon: "🌫️" };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { condition: "Rainy", icon: "🌧️" };
  if ([95, 96, 99].includes(code)) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Breezy", icon: "💨" };
};
