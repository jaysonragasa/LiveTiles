import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { useWeather } from './useWeather';

export const WeatherApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  const { data, loading, error } = useWeather();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[100] ${tile.colorClass.split(' ')[0]} flex flex-col shadow-2xl`}
    >
      <header className="h-16 bg-black/30 flex items-center px-6 justify-between backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Icons.CloudSun className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold tracking-wide uppercase text-sm">Weather</h2>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 rounded-full transition-all text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-6xl font-light mb-8">Weather Forecast</h1>
          
          {loading && <p className="text-2xl font-light">Loading latest weather data...</p>}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-xl">
              <p className="text-xl">{error}</p>
              <p className="mt-2 text-sm text-white/70">Ensure you have added your OpenWeatherMap API key to the .env file.</p>
            </div>
          )}
          
          {data && (
            <>
              <div className="bg-white/10 p-8 rounded-2xl border border-white/10 mb-8 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h2 className="text-5xl font-medium mb-2">{data.current.temp}°F</h2>
                  <p className="text-2xl font-light opacity-90">{data.current.description}</p>
                  <p className="text-lg opacity-70 mt-1">{data.current.city}</p>
                </div>
                <Icons.CloudSun className="w-24 h-24 opacity-80" />
              </div>
              
              <h3 className="text-2xl font-light mb-6">3-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {data.forecast.map((line, i) => (
                   <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                     <p className="text-xl whitespace-pre-wrap">{line}</p>
                   </div>
                 ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
