import { Program } from '../../types';
import { WeatherTile } from './WeatherTile';
import { WeatherApp } from './WeatherApp';

export const WeatherProgram: Program = {
  id: 'weather',
  title: 'Weather',
  icon: 'CloudSun',
  defaultColorClass: 'bg-[#00A4EF]',
  TileComponent: WeatherTile,
  AppComponent: WeatherApp
};
