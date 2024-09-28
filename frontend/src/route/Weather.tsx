import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplet,
  ThermometerSun,
  Loader2,
} from "lucide-react";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Miami");

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get the latitude and longitude for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude } = geoData.results[0];

      // Then, fetch the weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        ...weatherData.current_weather,
        city: geoData.results[0].name,
        country: geoData.results[0].country,
        humidity: weatherData.hourly.relativehumidity_2m[0],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherIcon = (weatherCode) => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (weatherCode <= 3) {
      return <Sun className="h-12 w-12 text-yellow-400" />;
    } else if (weatherCode <= 48) {
      return <Cloud className="h-12 w-12 text-gray-400" />;
    } else if (weatherCode <= 67) {
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    } else {
      return <Cloud className="h-12 w-12 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Weather App
          </CardTitle>
        </CardHeader> */}
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4 mt-6">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {loading && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Loading weather data...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {weather.city}, {weather.country}
              </h2>
              <div className="flex justify-center items-center mb-4">
                {getWeatherIcon(weather.weathercode)}
                <span className="text-4xl ml-4">
                  {Math.round(weather.temperature)}°C
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center">
                  <ThermometerSun className="h-5 w-5 mr-2" />
                  <span>Temperature: {Math.round(weather.temperature)}°C</span>
                </div>
                <div className="flex items-center justify-center">
                  <Wind className="h-5 w-5 mr-2" />
                  <span>Wind: {Math.round(weather.windspeed)} km/h</span>
                </div>
                <div className="flex items-center justify-center">
                  <Droplet className="h-5 w-5 mr-2" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                <div className="flex items-center justify-center">
                  <Cloud className="h-5 w-5 mr-2" />
                  <span>Weather Code: {weather.weathercode}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
