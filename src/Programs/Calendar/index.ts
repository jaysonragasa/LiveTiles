import { Program } from '../../types';
import { CalendarTile } from './CalendarTile';
import { CalendarApp } from './CalendarApp';

export const CalendarProgram: Program = {
  id: 'calendar',
  title: 'Calendar',
  icon: 'Calendar',
  defaultColorClass: 'bg-[#68217A]',
  TileComponent: CalendarTile,
  AppComponent: CalendarApp,
};
