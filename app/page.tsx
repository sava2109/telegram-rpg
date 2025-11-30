'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import GameLog from '@/components/GameLog';
import ActionPanel from '@/components/ActionPanel';
import { supabase } from '@/lib/supabase';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'loot' | 'error';
  timestamp: number;
}

export default function Home() {
  const { user, isReady, tg } = useTelegram();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial welcome message
  useEffect(() => {
    if (isReady && user) {
      addLog(`Welcome, ${user.first_name}! The dungeon awaits.`, 'info');
    } else if (isReady && !user) {
      addLog('Welcome, Traveler! (Running outside Telegram?)', 'info');
    }
  }, [isReady, user]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    }]);
  };

  const handleAction = async (actionId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Haptic feedback
    if (tg) tg.HapticFeedback.impactOccurred('medium');

    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: actionId, 
          user: user || { id: 12345, first_name: 'TestUser' } // Fallback for testing in browser
        }),
      });

      const data = await response.json();

      if (data.error) {
        addLog(data.error, 'error');
      } else {
        addLog(data.message, data.type);
        // TODO: Update stats in UI based on data.userStats
      }

    } catch (error) {
      addLog('Connection error.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-rpg-bg text-rpg-text overflow-hidden">
      {/* Header / Stats Bar */}
      <div className="bg-rpg-panel p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{user?.first_name || 'Hero'}</span>
          <span className="text-xs text-gray-400">Lvl 1 Warrior</span>
        </div>
        <div className="flex gap-4">
          <div className="text-red-500 font-bold">HP: 100/100</div>
          <div className="text-rpg-accent font-bold">Gold: 0</div>
        </div>
      </div>

      {/* Game Log Area */}
      <GameLog logs={logs} />

      {/* Controls */}
      <ActionPanel onAction={handleAction} disabled={isProcessing} />
    </main>
  );
}
