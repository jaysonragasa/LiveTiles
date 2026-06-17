/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Responsive, LayoutItem, ResponsiveLayouts } from 'react-grid-layout/legacy';
import { initialTiles, initialLayouts, ALL_APPS } from './data';
import { Tile } from './components/Tile';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { ProgramRegistry } from './Programs/registry';

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

const STORAGE_KEY_LAYOUTS = 'live-tiles-layouts';
const STORAGE_KEY_TILES = 'live-tiles-data';

export default function App() {
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAYOUTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { c12: initialLayouts };
  });
  
  const [tiles, setTiles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TILES);
      if (saved) {
        // Merge saved tiles with base app definitions to ensure we don't lose new fields
        const parsed = JSON.parse(saved);
        return parsed.map((savedTile: any) => {
          const baseApp = ALL_APPS.find(a => a.id === savedTile.id);
          return baseApp ? { ...baseApp, ...savedTile } : savedTile;
        });
      }
    } catch (e) {}
    return initialTiles;
  });
  
  const [mounted, setMounted] = useState(false);
  const [cols, setCols] = useState(12);
  const [containerWidth, setContainerWidth] = useState(1240);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, tileId: string} | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  const handleContextMenu = (e: React.MouseEvent, tileId: string) => {
    e.preventDefault();
    
    const menuWidth = 192; // w-48 is 192px
    const menuHeight = 350; // Accurate height of the context menu including colors and buttons
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = Math.max(10, window.innerHeight - menuHeight - 10);
    }
    
    setContextMenu({ x, y, tileId });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  
  useEffect(() => {
    setMounted(true);
    
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
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY_LAYOUTS, JSON.stringify(layouts));
    }
  }, [layouts, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY_TILES, JSON.stringify(tiles));
    }
  }, [tiles, mounted]);

  const onLayoutChange = (layout: LayoutItem[], allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  };

  const resizeTile = (id: string, size: 'small' | 'medium' | 'wide' | 'large') => {
    let w = 1, h = 1;
    if (size === 'small') { w = 1; h = 1; }
    else if (size === 'medium') { w = 2; h = 2; }
    else if (size === 'wide') { w = 4; h = 2; }
    else if (size === 'large') { w = 4; h = 4; }

    setLayouts(prev => {
      const newLayouts = { ...prev };
      for (const bp of Object.keys(newLayouts)) {
        newLayouts[bp] = newLayouts[bp].map(item => 
          item.i === id ? { ...item, w, h } : item
        );
      }
      return newLayouts;
    });
  };

  const unpinTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const changeTileColor = (id: string, colorClass: string) => {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, colorClass } : t));
  };

  const addApp = (appId: string) => {
    if (tiles.some(t => t.id === appId)) return;
    const newApp = ALL_APPS.find(a => a.id === appId);
    if (!newApp) return;

    setTiles(prev => [...prev, newApp]);
    setLayouts(prev => {
      const newLayouts = { ...prev };
      for (const bp of Object.keys(newLayouts)) {
        const lastY = Math.max(0, ...newLayouts[bp].map(item => item.y + item.h));
        newLayouts[bp] = [...newLayouts[bp], { i: appId, x: 0, y: lastY, w: 2, h: 2, minW: 1, minH: 1 }];
      }
      return newLayouts;
    });
    setIsDrawerOpen(false);
  };

  const COLORS = [
    'bg-[#0078D7]', 'bg-[#68217A]', 'bg-[#107C10]', 'bg-[#00A4EF]', 
    'bg-[#D83B01]', 'bg-[#B4009E]', 'bg-[#002050]', 'bg-[#767676]', 'bg-[#E81123]'
  ];

  // Dynamically calculate grid width based on the furthest tile to the right
  const activeLayout = layouts.c12 || [];
  const maxRightCol = activeLayout.length > 0 
    ? Math.max(...activeLayout.map(item => item.x + item.w))
    : 12;
  
  // Ensure we always have a minimum of 12 columns, and add 4 padding columns to the right for easy dragging
  const dynamicCols = Math.max(12, maxRightCol + 4);
  const dynamicWidth = dynamicCols * 80;
  
  // We override the custom breakpoints to only use a single layout constraint,
  // preventing it from wrapping items to the next line on smaller screens.
  const dynamicBreakpoints = { c12: 0 };
  const dynamicCustomCols = { c12: dynamicCols };

  const ActiveAppComponent = activeApp && ProgramRegistry[activeApp] 
    ? ProgramRegistry[activeApp].AppComponent 
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-12 overflow-x-auto flex flex-col font-sans select-none items-start">
      <header className="flex justify-between items-end mb-10 w-full min-w-[800px]">
        <h1 className="text-6xl font-light tracking-tight text-white/90">Start</h1>
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-right hidden sm:block">
            <div className="text-lg font-medium leading-none">Alex Chen</div>
            <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Pro Account</div>
          </span>
          <div className="w-12 h-12 bg-[#0078D7] rounded-full border-2 border-white/20 flex items-center justify-center text-xl font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/40 transition-all" onClick={() => setIsDrawerOpen(true)}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover hover:scale-110 transition-transform" />
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex justify-start pb-20">
        <div style={{ width: dynamicWidth, minWidth: dynamicWidth }}>
          {mounted && (
            <Responsive
              className="layout"
              layouts={layouts}
              breakpoints={dynamicBreakpoints}
              cols={dynamicCustomCols}
              width={dynamicWidth}
              rowHeight={70}
              margin={[10, 10]}
              containerPadding={[0, 0]}
              onLayoutChange={onLayoutChange}
              onDragStart={() => { isDraggingRef.current = true; }}
              onDragStop={() => { setTimeout(() => { isDraggingRef.current = false; }, 50); }}
              onResizeStart={() => { isResizingRef.current = true; }}
              onResizeStop={() => { setTimeout(() => { isResizingRef.current = false; }, 50); }}
              isBounded={false}
              compactType="vertical"
              useCSSTransforms={true}
              draggableCancel=".no-drag"
            >
              {tiles.map(tile => (
                <div 
                  key={tile.id}
                  onContextMenu={(e) => handleContextMenu(e, tile.id)}
                  onPointerUp={(e) => {
                    if (isDraggingRef.current || isResizingRef.current) return;
                    if (e.button !== 0) return; // Only allow left click to open app
                    setActiveApp(tile.id);
                  }}
                >
                  <Tile tile={tile} />
                </div>
              ))}
            </Responsive>
          )}
        </div>
      </div>
      
      {contextMenu && (
        <div 
          className="fixed z-50 bg-[#2D2D2D] border border-white/20 shadow-2xl rounded-md w-48 py-1 overflow-hidden font-sans"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-xs text-white/50 uppercase tracking-wider mb-1">Resize</div>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => { resizeTile(contextMenu.tileId, 'small'); closeContextMenu(); }}>Small (1x1)</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => { resizeTile(contextMenu.tileId, 'medium'); closeContextMenu(); }}>Medium (2x2)</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => { resizeTile(contextMenu.tileId, 'wide'); closeContextMenu(); }}>Wide (4x2)</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => { resizeTile(contextMenu.tileId, 'large'); closeContextMenu(); }}>Large (4x4)</button>
          
          <div className="h-px bg-white/10 my-1"></div>
          
          <div className="px-3 py-1 text-xs text-white/50 uppercase tracking-wider mb-1">Color</div>
          <div className="px-3 py-1 flex flex-wrap gap-2 mb-2">
            {COLORS.map(c => (
              <button 
                key={c} 
                className={`w-6 h-6 rounded-full ${c.split(' ')[0]} border border-white/20 hover:scale-110 transition-transform`}
                onClick={() => { changeTileColor(contextMenu.tileId, c); closeContextMenu(); }}
              />
            ))}
          </div>

          <div className="h-px bg-white/10 my-1"></div>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-red-400" onClick={() => { unpinTile(contextMenu.tileId); closeContextMenu(); }}>Unpin from Start</button>
        </div>
      )}

      <AnimatePresence>
        {ActiveAppComponent && activeApp && (
          <ActiveAppComponent 
            tile={tiles.find(t => t.id === activeApp)!} 
            onClose={() => setActiveApp(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#1F1F1F] z-50 shadow-2xl border-l border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-2xl font-light">All Apps</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {ALL_APPS.map(app => {
                  const isPinned = tiles.some(t => t.id === app.id);
                  const IconComponent = app.icon && (Icons as any)[app.icon] ? (Icons as any)[app.icon] : Icons.Box;
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 group transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded ${app.colorClass.split(' ')[0]} flex items-center justify-center border border-white/10`}>
                          <IconComponent className="w-5 h-5 opacity-90 text-white" />
                        </div>
                        <span className="font-medium text-white/90">{app.title}</span>
                      </div>
                      {!isPinned ? (
                        <button 
                          onClick={() => addApp(app.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider"
                        >
                          Pin
                        </button>
                      ) : (
                        <span className="text-xs text-white/40 uppercase tracking-wider pr-2">Pinned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
