'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'loot' | 'error';
  timestamp: number;
}

interface GameLogProps {
  logs: LogEntry[];
}

export default function GameLog({ logs }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-rpg-bg">
      {logs.map((log) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2 rounded text-sm ${
            log.type === 'combat' ? 'text-red-400' :
            log.type === 'loot' ? 'text-yellow-400' :
            log.type === 'error' ? 'text-red-600' :
            'text-gray-300'
          }`}
        >
          <span className="text-xs text-gray-500 mr-2">
            [{new Date(log.timestamp).toLocaleTimeString()}]
          </span>
          {log.message}
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
