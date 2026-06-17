import React from 'react';
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

export interface Program {
    id: string;
    title: string;
    icon?: string;
    defaultColorClass: string;
    TileComponent: React.FC<{ tile: TileData }>;
    AppComponent: React.FC<{ tile: TileData; onClose: () => void }>;
}
