import React from 'react';
import { Program } from '../../types';
import { FlipTile } from '../../components/TileHelpers';
import { useWeather } from './useWeather';

export const WeatherTile: React.FC<{ tile: any }> = ({ tile }) => {
  const { data, loading, error } = useWeather();

  let content = ["Loading..."];
  if (error) {
    content = ["Error loading weather"];
  } else if (data) {
    content = [
      `${data.current.temp}°F\n${data.current.description}\n${data.current.city}`,
      data.forecast[0] || "No forecast"
    ];
  }

  return (
    <FlipTile 
      tile={tile} 
      title="Weather"
      icon="CloudSun"
      content={content} 
    />
  );
};
