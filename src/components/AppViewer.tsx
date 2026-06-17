import React from 'react';
import { TileData } from '../types';
import { getProgram } from '../Programs/registry';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface AppViewerProps {
  tile: TileData;
  onClose: () => void;
}

export const AppViewer: React.FC<AppViewerProps> = ({ tile, onClose }) => {
  const program = getProgram(tile.id);
  
  if (program) {
    const AppComponent = program.AppComponent;
    return <AppComponent tile={tile} onClose={onClose} />;
  }

  // Fallback if program somehow doesn't exist
  const IconComponent = tile.icon && (Icons as any)[tile.icon] ? (Icons as any)[tile.icon] : Icons.Box;
  const bgColor = tile.colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-800';

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
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg flex items-center justify-center">
        <h1 className="text-3xl text-white">Program Not Found</h1>
      </div>
    </motion.div>
  );
};

