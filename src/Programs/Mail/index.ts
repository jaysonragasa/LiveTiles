import { Program } from '../../types';
import { MailTile } from './MailTile';
import { MailApp } from './MailApp';

export const MailProgram: Program = {
  id: 'mail',
  title: 'Mail',
  icon: 'Mail',
  defaultColorClass: 'bg-[#0078D7]',
  TileComponent: MailTile,
  AppComponent: MailApp
};
