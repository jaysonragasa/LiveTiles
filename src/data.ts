import { TileData } from './types';
import { LayoutItem } from 'react-grid-layout/legacy';

export const initialTiles: TileData[] = [
  { id: 'mail', type: 'slide', colorClass: 'bg-[#0078D7]', title: 'Mail', icon: 'Mail', content: ['3 New Emails', 'Meeting at 10 AM', 'Invoice #204 attached'], slideDirection: 'up' },
  { id: 'calendar', type: 'flip', colorClass: 'bg-[#68217A]', title: 'Calendar', icon: 'Calendar', content: ['10:00 AM\nTeam Standup\nRoom A', '1:00 PM\nLunch with Client'] },
  { id: 'photos', type: 'slide', colorClass: 'bg-[#107C10]', title: 'Photos', icon: 'Image', images: ['https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80'], slideDirection: 'left' },
  { id: 'weather', type: 'flip', colorClass: 'bg-[#00A4EF]', title: 'Weather', icon: 'CloudSun', content: ['72°F\nSunny\nSeattle, WA', 'Tomorrow:\n68°F Partly Cloudy'] },
  { id: 'edge', type: 'static', colorClass: 'bg-[#0078D7]', title: 'Edge', icon: 'Globe' },
  { id: 'store', type: 'static', colorClass: 'bg-[#D83B01]', title: 'Store', icon: 'ShoppingBag' },
  { id: 'music', type: 'flip', colorClass: 'bg-[#B4009E]', title: 'Music', icon: 'Music', content: ['Now Playing:\nSynthwave Mix', 'Next:\nMidnight City'] },
  { id: 'maps', type: 'static', colorClass: 'bg-[#107C10]', title: 'Maps', icon: 'Map' },
  { id: 'news', type: 'slide', colorClass: 'bg-[#002050] border-l-4 border-[#00A4EF]', title: 'News', icon: 'Newspaper', content: ['Market hits all-time high', 'Local team wins championship!'], slideDirection: 'down' },
  { id: 'xbox', type: 'static', colorClass: 'bg-[#107C10]', title: 'Xbox', icon: 'Gamepad2' },
  { id: 'calc', type: 'static', colorClass: 'bg-[#767676]', title: 'Calculator', icon: 'Calculator' },
  { id: 'alarm', type: 'static', colorClass: 'bg-[#2D2D2D] border-t-8 border-[#FFB900]', title: 'Alarms', icon: 'AlarmClock' }
];

// Layout is exactly matched by id `i`. The minW, minH ensure typical boundaries
export const initialLayouts: LayoutItem[] = [
  { i: 'mail', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
  { i: 'calendar', x: 4, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'photos', x: 0, y: 2, w: 4, h: 4, minW: 2, minH: 2 },
  { i: 'weather', x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
  { i: 'edge', x: 6, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'store', x: 8, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'music', x: 8, y: 2, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'maps', x: 10, y: 0, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'news', x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2 },
  { i: 'xbox', x: 8, y: 4, w: 2, h: 2, minW: 1, minH: 1 },
  { i: 'calc', x: 10, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
  { i: 'alarm', x: 10, y: 3, w: 1, h: 1, minW: 1, minH: 1 },
];

export const ALL_APPS: TileData[] = [
  ...initialTiles,
  { id: 'settings', type: 'static', colorClass: 'bg-[#4C4A48]', title: 'Settings', icon: 'Settings' },
  { id: 'camera', type: 'static', colorClass: 'bg-[#00A4EF]', title: 'Camera', icon: 'Camera' },
  { id: 'netflix', type: 'static', colorClass: 'bg-[#E50914]', title: 'Netflix', icon: 'Film' },
  { id: 'spotify', type: 'static', colorClass: 'bg-[#1DB954]', title: 'Spotify', icon: 'Headphones' },
];
