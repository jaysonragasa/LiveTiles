import React from 'react';
import { Program } from '../types';
import { StaticTile, FlipTile, SlideTile } from '../components/TileHelpers';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

const GenericApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  const IconComponent = tile.icon && (Icons as any)[tile.icon] ? (Icons as any)[tile.icon] : Icons.Box;
  const bgColor = tile.colorClass.split(' ').find((c: string) => c.startsWith('bg-')) || 'bg-gray-800';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[100] ${bgColor} flex flex-col shadow-2xl`}
    >
      <header className="h-16 bg-black/30 flex items-center px-6 justify-between backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-3">
          <IconComponent className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold tracking-wide uppercase text-sm">{tile.title}</h2>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 rounded-full transition-all text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-[60vh] text-center text-white">
            <IconComponent className="w-32 h-32 text-white/20 mb-8" />
            <h1 className="text-5xl font-light mb-4">{tile.title} App</h1>
            <p className="text-xl text-white/60 max-w-md mx-auto">This application view is currently under construction. More features coming soon.</p>
        </div>
      </div>
    </motion.div>
  );
};

export const createGenericProgram = (
    id: string, 
    title: string, 
    icon: string, 
    color: string, 
    type: 'static'|'flip'|'slide', 
    content?: string[], 
    images?: string[], 
    slideDirection?: 'up'|'down'|'left'|'right'
): Program => {
  return {
    id,
    title,
    icon,
    defaultColorClass: color,
    TileComponent: ({ tile }) => {
        if (type === 'flip') return <FlipTile tile={tile} content={content || []} icon={icon} title={title} />;
        if (type === 'slide') return <SlideTile tile={tile} content={content} images={images} icon={icon} title={title} slideDirection={slideDirection} />;
        return <StaticTile tile={tile} icon={icon} title={title} />;
    },
    AppComponent: GenericApp
  };
};
