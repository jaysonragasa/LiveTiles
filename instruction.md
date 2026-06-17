# How to Create a Live Tile App

Welcome to the Live Tiles Developer Guide! This guide will walk you through creating a new modular Live Tile application for the ecosystem. 

Each application is a self-contained module consisting of a **TileComponent** (the widget on the start screen) and an **AppComponent** (the full-screen interactive view).

## Step 1: Create the Program Folder
Navigate to the `src/Programs/` directory and create a new folder for your app. For this example, we will create a `Notes` app.

```bash
mkdir src/Programs/Notes
```

## Step 2: Create the Tile Component
Create a file named `NotesTile.tsx` inside your new folder.

The Tile Component dictates how your app looks on the Start screen. **Tiles are strictly display-only.** An invisible "curtain" overlay intercepts all clicks, meaning users cannot interact with buttons or inputs placed inside this component.

You can use the built-in tile helpers (`StaticTile`, `FlipTile`, `SlideTile`) from `src/components/TileHelpers.tsx`.

```tsx
// src/Programs/Notes/NotesTile.tsx
import React from 'react';
import { FlipTile } from '../../components/TileHelpers';

export const NotesTile: React.FC<{ tile: any }> = ({ tile }) => {
  return (
    <FlipTile 
      tile={tile} 
      title="Notes"
      icon="FileText" // Matches an icon from lucide-react
      content={[
        "Groceries:\n- Milk\n- Eggs\n- Bread", 
        "Idea:\nNew app architecture"
      ]} 
    />
  );
};
```

## Step 3: Create the Full-Screen App Component
Create a file named `NotesApp.tsx` inside your folder. 

This is the fully interactive application that launches when a user clicks your tile. You receive an `onClose` prop which must be bound to a back/close button to return the user to the Start screen.

```tsx
// src/Programs/Notes/NotesApp.tsx
import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react'; // Required for launch animations

export const NotesApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  // We extract the base color from the tile settings
  const bgColor = tile.colorClass.split(' ')[0] || 'bg-[#FFB900]';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[100] ${bgColor} flex flex-col shadow-2xl`}
    >
      <header className="h-16 bg-black/30 flex items-center px-6 justify-between backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Icons.FileText className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold tracking-wide uppercase text-sm">Notes</h2>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-5xl font-light mb-8">My Notes</h1>
          <textarea 
            className="w-full h-64 bg-white/10 p-4 rounded text-white border border-white/20"
            placeholder="Type your notes here..."
          />
        </div>
      </div>
    </motion.div>
  );
};
```

## Step 4: Export the Program Configuration
Create an `index.ts` file in your app's folder to bundle everything together into the required `Program` interface.

```typescript
// src/Programs/Notes/index.ts
import { Program } from '../../types';
import { NotesTile } from './NotesTile';
import { NotesApp } from './NotesApp';

export const NotesProgram: Program = {
  id: 'notes',
  title: 'Notes',
  icon: 'FileText',
  defaultColorClass: 'bg-[#FFB900]', // A nice yellow for notes
  TileComponent: NotesTile,
  AppComponent: NotesApp
};
```

## Step 5: Register the App
Finally, open `src/Programs/registry.ts` and add your newly created program to the central registry. This makes it discoverable by the "All Apps" drawer and the layout engine.

```typescript
// src/Programs/registry.ts
import { Program } from '../types';
import { WeatherProgram } from './Weather';
import { MailProgram } from './Mail';
import { NotesProgram } from './Notes'; // 1. Import your program
import { createGenericProgram } from './Generic';

export const ProgramRegistry: Record<string, Program> = {
  weather: WeatherProgram,
  mail: MailProgram,
  notes: NotesProgram, // 2. Add it to the registry
  // ...other generic apps
};
```

## Done!
Restart your dev server if necessary. Click on your profile avatar in the top right to open the App Drawer, find your new **Notes** app, and click **PIN** to add it to your Start screen!
