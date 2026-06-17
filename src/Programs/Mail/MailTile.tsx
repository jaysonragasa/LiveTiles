import React from 'react';
import { SlideTile } from '../../components/TileHelpers';

export const MailTile: React.FC<{ tile: any }> = ({ tile }) => {
  return (
    <SlideTile 
      tile={tile} 
      title="Mail"
      icon="Mail"
      content={[
        "3 New Emails", 
        "Meeting at 10 AM", 
        "Invoice #204 attached"
      ]} 
      slideDirection="up"
    />
  );
};
