import React from 'react';
import { FlipTile } from '../../components/TileHelpers';

export const CalculatorTile: React.FC<{ tile: any }> = ({ tile }) => {
  return (
    <FlipTile 
      tile={tile} 
      title="Graphing Calc"
      icon="Calculator"
      content={["f(x) = sin(x)", "y = x^2 - 4", "Ready to plot"]} 
    />
  );
};
