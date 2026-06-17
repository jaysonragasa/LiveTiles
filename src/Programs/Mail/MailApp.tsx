import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export const MailApp: React.FC<{ tile: any; onClose: () => void }> = ({ tile, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[100] ${tile.colorClass.split(' ')[0]} flex flex-col shadow-2xl`}
    >
      <header className="h-16 bg-black/30 flex items-center px-6 justify-between backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Icons.Mail className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold tracking-wide uppercase text-sm">Mail</h2>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 rounded-full transition-all text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 overflow-auto p-8 bg-black/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-white space-y-4">
          <h1 className="text-5xl font-light mb-8">Inbox</h1>
          <div className="space-y-3">
            {["3 New Emails", "Meeting at 10 AM", "Invoice #204 attached"].map((line, i) => (
              <div key={i} className="bg-white/10 p-5 rounded-lg border border-white/10 hover:bg-white/20 cursor-pointer transition-all flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#0078D7] flex items-center justify-center shrink-0">
                  <Icons.User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{line}</p>
                  <p className="text-white/60 text-sm">Tap to read message...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
