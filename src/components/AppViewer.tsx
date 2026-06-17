import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { TileData } from '../types';

interface AppViewerProps {
  tile: TileData;
  onClose: () => void;
}

export const AppViewer: React.FC<AppViewerProps> = ({ tile, onClose }) => {
  const IconComponent = tile.icon && (Icons as any)[tile.icon] ? (Icons as any)[tile.icon] : Icons.Box;
  
  // Extract just the background color
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
      
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto">
          {tile.id === 'weather' ? (
            <div className="text-white">
               <h1 className="text-6xl font-light mb-8">Weather Forecast</h1>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {tile.content?.map((line, i) => (
                   <div key={i} className="bg-white/10 p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                     <p className="text-xl whitespace-pre-wrap">{line}</p>
                   </div>
                 ))}
               </div>
            </div>
          ) : tile.id === 'mail' ? (
            <div className="text-white space-y-4">
              <h1 className="text-5xl font-light mb-8">Inbox</h1>
              <div className="space-y-3">
                {tile.content?.map((line, i) => (
                  <div key={i} className="bg-white/10 p-5 rounded-lg border border-white/10 hover:bg-white/20 cursor-pointer transition-all flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#0078D7] flex items-center justify-center shrink-0">
                      <Icons.User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{line}</p>
                      <p className="text-white/60 text-sm">Tap to read message...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : tile.images && tile.images.length > 0 ? (
            <div className="text-white space-y-4">
              <h1 className="text-5xl font-light mb-8">{tile.title}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {tile.images.map((img, i) => (
                   <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-xl border border-white/20">
                     <img src={img} alt={`${tile.title} ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                   </div>
                 ))}
              </div>
            </div>
          ) : (
             <div className="text-white flex flex-col items-center justify-center h-[60vh] text-center">
               <IconComponent className="w-32 h-32 text-white/20 mb-8" />
               <h1 className="text-5xl font-light mb-4">{tile.title} App</h1>
               <p className="text-xl text-white/60 max-w-md mx-auto">This application view is currently under construction. More features coming soon.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
