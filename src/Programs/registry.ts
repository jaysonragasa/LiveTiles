import { Program } from '../types';
import { WeatherProgram } from './Weather';
import { MailProgram } from './Mail';
import { createGenericProgram } from './Generic';

export const ProgramRegistry: Record<string, Program> = {
  weather: WeatherProgram,
  mail: MailProgram,
  calendar: createGenericProgram('calendar', 'Calendar', 'Calendar', 'bg-[#68217A]', 'flip', ['10:00 AM\nTeam Standup\nRoom A', '1:00 PM\nLunch with Client']),
  photos: createGenericProgram('photos', 'Photos', 'Image', 'bg-[#107C10]', 'slide', undefined, ['https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80'], 'left'),
  edge: createGenericProgram('edge', 'Edge', 'Globe', 'bg-[#0078D7]', 'static'),
  store: createGenericProgram('store', 'Store', 'ShoppingBag', 'bg-[#D83B01]', 'static'),
  music: createGenericProgram('music', 'Music', 'Music', 'bg-[#B4009E]', 'flip', ['Now Playing:\nSynthwave Mix', 'Next:\nMidnight City']),
  maps: createGenericProgram('maps', 'Maps', 'Map', 'bg-[#107C10]', 'static'),
  news: createGenericProgram('news', 'News', 'Newspaper', 'bg-[#002050] border-l-4 border-[#00A4EF]', 'slide', ['Market hits all-time high', 'Local team wins championship!'], undefined, 'down'),
  xbox: createGenericProgram('xbox', 'Xbox', 'Gamepad2', 'bg-[#107C10]', 'static'),
  calc: createGenericProgram('calc', 'Calculator', 'Calculator', 'bg-[#767676]', 'static'),
  alarm: createGenericProgram('alarm', 'Alarms', 'AlarmClock', 'bg-[#2D2D2D] border-t-8 border-[#FFB900]', 'static'),
  settings: createGenericProgram('settings', 'Settings', 'Settings', 'bg-[#4C4A48]', 'static'),
  camera: createGenericProgram('camera', 'Camera', 'Camera', 'bg-[#00A4EF]', 'static'),
  netflix: createGenericProgram('netflix', 'Netflix', 'Film', 'bg-[#E50914]', 'static'),
  spotify: createGenericProgram('spotify', 'Spotify', 'Headphones', 'bg-[#1DB954]', 'static')
};

export const getProgram = (id: string): Program | undefined => {
  return ProgramRegistry[id];
};

export const getAllPrograms = (): Program[] => {
  return Object.values(ProgramRegistry);
};
