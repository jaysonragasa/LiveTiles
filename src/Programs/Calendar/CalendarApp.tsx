import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { generateMockEvents } from './mockData';

// User requested flag to toggle between scroll types
const SCROLL_DIRECTION: 'horizontal' | 'vertical' = 'horizontal';

export const CalendarApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  const events = generateMockEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 3 months (prev, current, next) for scrolling
  const months = [-1, 0, 1].map(offset => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      dateObj: d,
    };
  });

  // When currentDate changes, we want to ensure we're looking at the middle month (index 1)
  useEffect(() => {
    if (containerRef.current) {
      if (SCROLL_DIRECTION === 'horizontal') {
        containerRef.current.scrollLeft = containerRef.current.clientWidth;
      } else {
        containerRef.current.scrollTop = containerRef.current.clientHeight;
      }
    }
  }, [currentDate]);

  const handleNext = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handlePrev = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const renderMonth = (year: number, month: number, dateObj: Date) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    
    // Previous month trailing days
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const prevDays = Array.from({ length: startDay }).map((_, i) => daysInPrevMonth - startDay + i + 1);
    
    const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
    
    // Next month leading days
    const totalCells = 42; // always 6 rows * 7 columns for uniform grid
    const remainingCells = totalCells - (startDay + daysInMonth);
    const nextDays = Array.from({ length: remainingCells }).map((_, i) => i + 1);

    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <div key={`${year}-${month}`} className="w-full h-full flex-shrink-0 snap-center flex flex-col p-12 overflow-hidden bg-white">
        <h1 className="text-[56px] font-light text-[#333] mb-2 leading-none">{monthName.split(' ')[0]} <span className="text-[#999]">{monthName.split(' ')[1]}</span></h1>
        
        <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 bg-white">
          {/* Weekday Headers */}
          {weekdays.map(day => (
            <div key={day} className="text-[#333] text-sm font-normal px-2 py-1">
              {day}
            </div>
          ))}

          {/* Grid Cells */}
          {prevDays.map((d, i) => (
            <div key={`prev-${i}`} className="bg-[#F2F2F2] relative p-1 min-h-[100px]">
              <span className="absolute top-1 right-2 text-lg text-[#AAA]">{d}</span>
            </div>
          ))}
          
          {days.map((d) => {
            const dayEvents = events.filter(e => e.date.getFullYear() === year && e.date.getMonth() === month && e.date.getDate() === d);
            const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === d;
            
            return (
              <div key={`day-${d}`} className={`${isToday ? 'bg-[#E5F3FF]' : 'bg-[#F2F2F2]'} relative p-1 min-h-[100px] flex flex-col pt-8`}>
                <span className={`absolute top-1 right-2 text-lg ${isToday ? 'font-bold text-[#0078D7]' : 'text-[#333]'}`}>{d}</span>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {dayEvents.map(e => (
                    <div key={e.id} className={`${e.color} text-white px-2 py-[2px] text-xs whitespace-nowrap overflow-hidden text-ellipsis shadow-sm`}>
                      {e.time && <span className="font-semibold mr-1">{e.time}</span>}
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {nextDays.map((d, i) => (
            <div key={`next-${i}`} className="bg-[#F2F2F2] relative p-1 min-h-[100px]">
              <span className="absolute top-1 right-2 text-lg text-[#AAA]">{d}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-white flex flex-col shadow-2xl font-sans"
    >
      <header className="h-16 flex items-center px-6 justify-between border-b border-[#E0E0E0] shrink-0 bg-white z-10">
        <div className="flex items-center space-x-3">
          <Icons.Calendar className="w-6 h-6 text-[#0078D7]" />
          <h2 className="text-[#333] font-semibold tracking-wide uppercase text-sm">Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handlePrev} className="p-2 hover:bg-black/5 rounded-full transition-colors"><Icons.ChevronLeft className="w-6 h-6 text-[#333]"/></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 hover:bg-black/5 rounded text-[#333] font-medium transition-colors">Today</button>
          <button onClick={handleNext} className="p-2 hover:bg-black/5 rounded-full transition-colors"><Icons.ChevronRight className="w-6 h-6 text-[#333]"/></button>
          <div className="w-px h-6 bg-[#E0E0E0] mx-2"></div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white rounded-full text-[#333] transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Viewport for Months */}
      <div 
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${SCROLL_DIRECTION === 'horizontal' ? 'flex-row snap-x snap-mandatory' : 'flex-col snap-y snap-mandatory'}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {months.map(m => renderMonth(m.year, m.month, m.dateObj))}
      </div>
    </motion.div>
  );
};
