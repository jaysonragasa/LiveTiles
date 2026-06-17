/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Responsive, LayoutItem, ResponsiveLayouts } from 'react-grid-layout/legacy';
import { initialTiles, initialLayouts } from './data';
import { Tile } from './components/Tile';

const customBreakpoints = {
  c12: 12 * 80 - 11,
  c11: 11 * 80 - 11,
  c10: 10 * 80 - 11,
  c9: 9 * 80 - 11,
  c8: 8 * 80 - 11,
  c7: 7 * 80 - 11,
  c6: 6 * 80 - 11,
  c5: 5 * 80 - 11,
  c4: 4 * 80 - 11,
  c3: 3 * 80 - 11,
  c2: 2 * 80 - 11,
  c1: 1 * 80 - 11,
};

const customCols = {
  c12: 12, c11: 11, c10: 10, c9: 9, c8: 8, c7: 7, c6: 6, c5: 5, c4: 4, c3: 3, c2: 2, c1: 1
};

export default function App() {
  const [layouts, setLayouts] = useState<ResponsiveLayouts>({ c12: initialLayouts });
  const [tiles, setTiles] = useState(initialTiles);
  
  const [mounted, setMounted] = useState(false);
  const [cols, setCols] = useState(12);
  const [containerWidth, setContainerWidth] = useState(1240);
  
  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      const maxAvailableWidth = window.innerWidth - 64; 
      let c = Math.floor((maxAvailableWidth + 10) / 80);
      if (c < 4) c = 4; 
      if (c > 12) c = 12;
      
      setCols(c);
      setContainerWidth(c * 80 - 10);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            if (!res.ok) throw new Error('Weather fetch failed');
            const data = await res.json();
            
            setTiles(prevTiles => prevTiles.map(tile => {
              if (tile.id === 'weather') {
                return {
                  ...tile,
                  content: [
                    `${Math.round(data.current.main.temp)}°F\n${data.current.weather[0].main}\n${data.current.name}`,
                    `High: ${Math.round(data.current.main.temp_max)}°F\nLow: ${Math.round(data.current.main.temp_min)}°F`,
                    data.forecast.join('\n')
                  ]
                };
              }
              return tile;
            }));
          } catch (err) {
            console.error(err);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onLayoutChange = (layout: LayoutItem[], allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-8 overflow-x-hidden flex flex-col font-sans select-none items-center">
      <header className="flex justify-between items-end mb-10 w-full" style={{ maxWidth: containerWidth }}>
        <h1 className="text-6xl font-light tracking-tight text-white/90">Start</h1>
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-right hidden sm:block">
            <div className="text-lg font-medium leading-none">Alex Chen</div>
            <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Pro Account</div>
          </span>
          <div className="w-12 h-12 bg-[#0078D7] rounded-full border-2 border-white/20 flex items-center justify-center text-xl font-bold overflow-hidden">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex justify-center">
        <div style={{ width: containerWidth }}>
          {mounted && (
            <Responsive
              className="layout"
              layouts={layouts}
              breakpoints={customBreakpoints}
              cols={customCols}
              width={containerWidth}
              rowHeight={70}
              margin={[10, 10]}
              containerPadding={[0, 0]}
              onLayoutChange={onLayoutChange}
              isBounded={false}
              compactType="vertical"
              useCSSTransforms={true}
              draggableCancel=".no-drag"
            >
              {tiles.map(tile => (
                <div key={tile.id}>
                  <Tile tile={tile} />
                </div>
              ))}
            </Responsive>
          )}
        </div>
      </div>
    </div>
  );
}
