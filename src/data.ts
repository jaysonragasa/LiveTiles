import { TileData } from './types';
import { LayoutItem } from 'react-grid-layout/legacy';
import { getAllPrograms } from './Programs/registry';

export const ALL_APPS: TileData[] = getAllPrograms().map(p => ({
  id: p.id,
  type: 'static',
  colorClass: p.defaultColorClass,
  title: p.title,
  icon: p.icon
}));

export const initialTiles: TileData[] = ALL_APPS.filter(t => [
  'mail', 'calendar', 'photos', 'weather', 'edge', 'store', 'music', 'maps', 'news', 'xbox', 'calc', 'alarm'
].includes(t.id));

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
