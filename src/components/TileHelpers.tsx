import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TileData } from '../types';
import { cn } from '../utils';

export const IconWrapper = ({ icon, className }: { icon?: string; className?: string }) => {
  // @ts-ignore
  const IconComponent = icon && Icons[icon] ? Icons[icon] : Icons.Box;
  return <IconComponent className={cn("opacity-80", className)} />;
};

export const StaticTile = ({ tile, icon, title }: { tile: TileData, icon?: string, title?: string }) => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <IconWrapper icon={icon || tile.icon} className="w-10 h-10 lg:w-12 lg:h-12 opacity-90" />
      </div>
      <div className="absolute bottom-2 left-3 right-3">
        <h3 className="font-semibold text-white text-[11px] tracking-wide truncate uppercase">{title || tile.title}</h3>
      </div>
    </div>
  );
};

export const FlipTile = ({ tile, content, icon, title }: { tile: TileData, content: string[], icon?: string, title?: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [contentIndex, setContentIndex] = useState(0);

  useEffect(() => {
    if (!content || content.length === 0) return;
    const timer = setInterval(() => {
      setIsFlipped(prev => {
        if (prev) {
          setTimeout(() => {
             setContentIndex(i => (i + 1) % content.length);
          }, 300);
        }
        return !prev;
      });
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="w-full h-full relative" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <IconWrapper icon={icon || tile.icon} className="w-10 h-10 lg:w-12 lg:h-12 opacity-90" />
          </div>
          <div className="absolute bottom-2 left-3 right-3">
            <h3 className="font-semibold text-white text-[11px] tracking-wide truncate uppercase">{title || tile.title}</h3>
          </div>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 p-3 bg-black/20" style={{ transform: "rotateX(180deg)", backfaceVisibility: 'hidden' }}>
          <div className="h-[calc(100%-24px)] overflow-hidden">
            <p className="text-white text-xs sm:text-sm font-medium leading-snug whitespace-pre-wrap">{content?.[contentIndex]}</p>
          </div>
          <div className="absolute bottom-2 left-3 right-3">
            <h3 className="font-semibold text-white text-[11px] tracking-wide opacity-80 truncate uppercase">{title || tile.title}</h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const SlideTile = ({ tile, content, images, icon, title, slideDirection }: { tile: TileData, content?: string[], images?: string[], icon?: string, title?: string, slideDirection?: 'up'|'down'|'left'|'right' }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = (content?.length || images?.length || 0) + 1;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % totalSlides);
    }, 3500 + Math.random() * 1000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const dir = slideDirection || tile.slideDirection || 'up';
  const offset = 100;
  
  const getInitial = () => {
    if (dir === 'up') return { y: `${offset}%`, x: 0 };
    if (dir === 'down') return { y: `-${offset}%`, x: 0 };
    if (dir === 'left') return { x: `${offset}%`, y: 0 };
    if (dir === 'right') return { x: `-${offset}%`, y: 0 };
    return { y: `${offset}%`, x: 0 };
  }
  
  const getExit = () => {
    if (dir === 'up') return { y: `-${offset}%`, x: 0 };
    if (dir === 'down') return { y: `${offset}%`, x: 0 };
    if (dir === 'left') return { x: `-${offset}%`, y: 0 };
    if (dir === 'right') return { x: `${offset}%`, y: 0 };
    return { y: `-${offset}%`, x: 0 };
  }

  const renderCover = () => (
    <div className="absolute inset-0 w-full h-full bg-inherit">
      {images?.[0] ? (
        <div className="absolute inset-0 w-full h-full -z-10 bg-black/40">
          <img src={images[0]} alt="cover" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
        </div>
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <IconWrapper icon={icon || tile.icon} className="w-10 h-10 lg:w-12 lg:h-12 opacity-90" />
      </div>
      <div className="absolute bottom-2 left-3 right-3 z-10">
        <h3 className="font-semibold text-white text-[11px] tracking-wide truncate uppercase">{title || tile.title}</h3>
      </div>
    </div>
  );

  const renderContent = (idx: number) => {
    const actIdx = idx - 1;
    if (images?.length) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <img src={images[actIdx % images.length]} alt="slide" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 pb-2">
            <h3 className="font-semibold text-white text-[11px] tracking-wide truncate uppercase">{title || tile.title}</h3>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0 p-3 bg-black/20 w-full h-full">
        <div className="h-[calc(100%-24px)] overflow-hidden">
          <p className="text-white text-xs sm:text-sm font-medium leading-snug whitespace-pre-wrap">{content?.[actIdx % (content.length || 1)]}</p>
        </div>
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="font-semibold text-white text-[11px] tracking-wide opacity-80 truncate uppercase">{title || tile.title}</h3>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={slideIndex}
          initial={getInitial()}
          animate={{ x: 0, y: 0 }}
          exit={getExit()}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {slideIndex === 0 ? renderCover() : renderContent(slideIndex)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
