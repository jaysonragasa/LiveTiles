import { LayoutItem } from 'react-grid-layout/legacy';

export type TileSize = 'small' | 'medium' | 'wide' | 'large';
export type TileType = 'static' | 'flip' | 'slide';

export interface TileData {
    id: string;
    type: TileType;
    colorClass: string;
    title: string;
    icon?: string;
    content?: string[];
    images?: string[]; 
    slideDirection?: 'up' | 'down' | 'left' | 'right';
}
