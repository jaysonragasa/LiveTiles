import React from 'react';
import { Program } from '../../types';
import { FlipTile } from '../../components/TileHelpers';

export const WeatherTile: React.FC<{ tile: any }> = ({ tile }) => {
  return (
    <FlipTile 
      tile={tile} 
      title="Weather"
      icon="CloudSun"
      content={[
        "72°F\nSunny\nSeattle, WA", 
        "Tomorrow:\n68°F Partly Cloudy"
      ]} 
    />
  );
};
