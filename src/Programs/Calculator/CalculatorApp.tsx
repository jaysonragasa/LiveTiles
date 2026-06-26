import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import * as math from 'mathjs';

const COLORS = ['#D32F2F', '#1976D2', '#388E3C', '#FBC02D', '#8E24AA', '#F57C00'];

export const CalculatorApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  const [expressions, setExpressions] = useState<string[]>(['sin(x)', 'x^2']);
  const [activeExprIndex, setActiveExprIndex] = useState(0);
  
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [pixelsPerUnit, setPixelsPerUnit] = useState(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const parsedFunctions = useMemo(() => {
    return expressions.map((expr, i) => {
      try {
        const fn = math.compile(expr);
        // Test evaluation
        fn.evaluate({ x: 0 });
        return { expr, fn, color: COLORS[i % COLORS.length], valid: true };
      } catch (e) {
        return { expr, fn: null, color: COLORS[i % COLORS.length], valid: false };
      }
    });
  }, [expressions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    // Grid scale heuristic to prevent too dense grid
    let step = 1;
    if (pixelsPerUnit < 15) step = 5;
    if (pixelsPerUnit < 5) step = 20;
    if (pixelsPerUnit > 150) step = 0.2;

    const startX = Math.floor((center.x - width/2/pixelsPerUnit)/step)*step;
    const endX = Math.ceil((center.x + width/2/pixelsPerUnit)/step)*step;
    for (let x = startX; x <= endX; x += step) {
       const px = width/2 + (x - center.x) * pixelsPerUnit;
       ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, height); ctx.stroke();
    }

    const startY = Math.floor((center.y - height/2/pixelsPerUnit)/step)*step;
    const endY = Math.ceil((center.y + height/2/pixelsPerUnit)/step)*step;
    for (let y = startY; y <= endY; y += step) {
       const py = height/2 - (y - center.y) * pixelsPerUnit;
       ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(width, py); ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    const originX = width/2 - center.x * pixelsPerUnit;
    const originY = height/2 + center.y * pixelsPerUnit;

    if (originX >= 0 && originX <= width) {
        ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();
    }
    if (originY >= 0 && originY <= height) {
        ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    }

    // Draw Functions
    parsedFunctions.forEach(f => {
      if (!f.valid || !f.fn) return;
      ctx.beginPath();
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 3;
      
      let isFirst = true;
      for (let px = 0; px < width; px += 2) {
        const logicalX = (px - width/2) / pixelsPerUnit + center.x;
        try {
            const logicalY = f.fn.evaluate({ x: logicalX });
            const py = height/2 - (logicalY - center.y) * pixelsPerUnit;
            
            if (Number.isFinite(py)) {
                // Clamp extremely large values to prevent canvas rendering bugs
                const clampedPy = Math.max(-height*2, Math.min(height*3, py));
                if (isFirst) { ctx.moveTo(px, clampedPy); isFirst = false; }
                else { ctx.lineTo(px, clampedPy); }
            } else {
                isFirst = true;
            }
        } catch(e) {
            isFirst = true;
        }
      }
      ctx.stroke();
    });
  }, [parsedFunctions, center, pixelsPerUnit]);

  // Interactivity
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setCenter(prev => ({ 
       x: prev.x - dx / pixelsPerUnit, 
       y: prev.y + dy / pixelsPerUnit 
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setPixelsPerUnit(prev => Math.max(1, Math.min(5000, prev * zoomFactor)));
  };

  const updateExpression = (index: number, val: string) => {
    const next = [...expressions];
    next[index] = val;
    setExpressions(next);
  };

  const addExpression = () => {
    setExpressions([...expressions, '']);
    setActiveExprIndex(expressions.length);
  };

  const removeExpression = (index: number) => {
    const next = expressions.filter((_, i) => i !== index);
    if (next.length === 0) next.push('');
    setExpressions(next);
    if (activeExprIndex >= next.length) setActiveExprIndex(Math.max(0, next.length - 1));
  };

  const insertChar = (char: string) => {
    const cur = expressions[activeExprIndex] || '';
    updateExpression(activeExprIndex, cur + char);
  };

  const keypadRows = [
    ['x', 'y', 'pi', 'e', '^', 'sqrt('],
    ['sin(', 'cos(', 'tan(', 'log(', '(', ')'],
    ['7', '8', '9', '/', 'C', 'DEL'],
    ['4', '5', '6', '*', '+', '-'],
    ['1', '2', '3', '.', '0', '=']
  ];

  const handleKeypad = (btn: string) => {
    if (btn === 'C') {
      updateExpression(activeExprIndex, '');
    } else if (btn === 'DEL') {
      const cur = expressions[activeExprIndex];
      updateExpression(activeExprIndex, cur.slice(0, -1));
    } else if (btn === '=') {
      // Evaluate if it's a numeric expression
      try {
        const cur = expressions[activeExprIndex];
        const res = math.evaluate(cur);
        if (typeof res === 'number') {
          updateExpression(activeExprIndex, res.toString());
        }
      } catch (e) {
        // Not a simple numeric evaluation
      }
    } else {
      insertChar(btn);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-white flex shadow-2xl font-sans"
    >
      {/* Sidebar */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col bg-[#F9F9F9] shrink-0">
        <header className="h-16 flex items-center px-6 justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Icons.Calculator className="w-6 h-6 text-[#1A73E8]" />
            <h2 className="text-[#333] font-semibold tracking-wide uppercase text-sm">Graphing Calc</h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white rounded-full text-[#333] transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </header>

        {/* Expression List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {expressions.map((expr, i) => {
            const parsed = parsedFunctions[i];
            const isActive = activeExprIndex === i;
            return (
              <div 
                key={i} 
                className={`flex items-center bg-white border ${isActive ? 'border-[#1A73E8] shadow-sm' : 'border-gray-200'} rounded-lg p-2 transition-all cursor-text`}
                onClick={() => setActiveExprIndex(i)}
              >
                <div className="w-8 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: parsed.color, opacity: parsed.valid ? 1 : 0.2 }} />
                </div>
                <input 
                  type="text" 
                  value={expr}
                  onChange={(e) => updateExpression(i, e.target.value)}
                  className={`flex-1 bg-transparent outline-none text-xl font-mono ${!parsed.valid && expr.length > 0 ? 'text-red-500' : 'text-[#333]'}`}
                  placeholder="e.g. sin(x)"
                />
                <button onClick={(e) => { e.stopPropagation(); removeExpression(i); }} className="p-2 text-gray-400 hover:text-red-500">
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          
          <button 
            onClick={addExpression}
            className="w-full py-3 mt-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-white hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>Add Expression</span>
          </button>
        </div>

        {/* Scientific Keypad */}
        <div className="bg-white border-t border-gray-200 p-2 shrink-0">
          <div className="grid grid-cols-6 gap-1">
            {keypadRows.map((row, rIdx) => 
              row.map((btn, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleKeypad(btn)}
                  className={`py-3 text-sm font-medium rounded ${
                    ['+', '-', '*', '/', '=', 'C', 'DEL'].includes(btn) 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : ['x', 'y', 'pi', 'e', 'sin(', 'cos(', 'tan(', 'log(', 'sqrt(', '^', '(', ')'].includes(btn)
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
                  } transition-colors select-none`}
                >
                  {btn}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-white relative cursor-crosshair overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="absolute inset-0 touch-none" />
        
        {/* Graph Controls overlay */}
        <div className="absolute top-6 right-6 flex flex-col space-y-2">
          <button onClick={() => setCenter({x:0, y:0})} className="p-3 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50 text-gray-600" title="Center Origin">
            <Icons.Target className="w-5 h-5" />
          </button>
          <button onClick={() => setPixelsPerUnit(p => Math.min(5000, p * 1.5))} className="p-3 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50 text-gray-600" title="Zoom In">
            <Icons.ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={() => setPixelsPerUnit(p => Math.max(1, p / 1.5))} className="p-3 bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50 text-gray-600" title="Zoom Out">
            <Icons.ZoomOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
