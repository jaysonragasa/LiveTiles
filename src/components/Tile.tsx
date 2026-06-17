import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TileData } from '../types';
import { cn } from '../utils';
import { getProgram } from '../Programs/registry';

interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  tile: TileData;
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(({ tile, className, style, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("w-full h-full select-none cursor-pointer group focus:outline-none focus:ring-4 focus:ring-white/20 active:scale-95 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", tile.colorClass, className)} 
      style={style} 
      {...props}
    >
      <div className={cn("tile-inner tile-container-ctx w-full h-full relative overflow-hidden transition-all duration-300")}>
        <div className="hide-on-small-tile w-full h-full relative">
          <TileInner tile={tile} />
        </div>
        <div className="show-on-small-tile absolute inset-0 w-full h-full items-center justify-center p-2">
          <IconWrapper icon={tile.icon} className="w-8 h-8 opacity-90 m-0" />
        </div>
      </div>
    </div>
  );
});

const TileInner = ({ tile }: { tile: TileData }) => {
  const program = getProgram(tile.id);
  if (program) {
    const TileComponent = program.TileComponent;
    return <TileComponent tile={tile} />;
  }
  return null;
};

const IconWrapper = ({ icon, className }: { icon?: string; className?: string }) => {
  // @ts-ignore
  const IconComponent = icon && Icons[icon] ? Icons[icon] : Icons.Box;
  return <IconComponent className={cn("opacity-80", className)} />;
};


