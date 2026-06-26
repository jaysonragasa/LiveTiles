import React from 'react';
import { FlipTile } from '../../components/TileHelpers';
import { generateMockEvents } from './mockData';

export const CalendarTile: React.FC<{ tile: any }> = ({ tile }) => {
  const events = generateMockEvents();
  const today = new Date();
  
  // Get upcoming events
  const upcoming = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2);

  const content = upcoming.map(e => 
    `${e.time ? e.time + ' ' : ''}${e.title}\n${e.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
  );

  if (content.length === 0) {
    content.push("No upcoming events");
  }

  return (
    <FlipTile 
      tile={tile} 
      title="Calendar"
      icon="Calendar"
      content={content} 
    />
  );
};
