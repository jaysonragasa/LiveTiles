import { Program } from '../../types';
import { CalculatorTile } from './CalculatorTile';
import { CalculatorApp } from './CalculatorApp';

export const CalculatorProgram: Program = {
  id: 'calc',
  title: 'Calculator',
  icon: 'Calculator',
  defaultColorClass: 'bg-[#767676]',
  TileComponent: CalculatorTile,
  AppComponent: CalculatorApp,
};
