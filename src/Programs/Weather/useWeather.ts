import { useState, useEffect } from 'react';

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    city: string;
  };
  forecast: string[];
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) {
          throw new Error('Failed to fetch weather');
        }
        const json = await res.json();
        
        if (mounted) {
          setData({
            current: {
              temp: Math.round(json.current.main.temp),
              description: json.current.weather[0].main,
              city: json.current.name,
            },
            forecast: json.forecast,
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          if (mounted) {
            setError('Geolocation denied or failed. Please enable location permissions.');
            setLoading(false);
          }
        }
      );
    } else {
      if (mounted) {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
