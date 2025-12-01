'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import Image from 'next/image';

interface GameState {
  location: string;
  hp: number;
  max_hp: number;
  gold: number;
  enemy_hp: number;
  message: string;
}

// Image mappings
const LOCATION_IMAGES: Record<string, string> = {
  START: '/images/locations/village.jpg',
  VILLAGE: '/images/locations/village.jpg',
  FOREST: '/images/locations/forest.jpg',
  CAVE: '/images/locations/cave.jpg',
  CASTLE: '/images/locations/castle.jpg',
  CRYPT: '/images/locations/crypt.jpg',
  TREASURE_ROOM: '/images/locations/treasure.jpg',
  TAVERN: '/images/locations/tavern.jpg',
  WELL: '/images/locations/well.jpg',
  BOSS_ROOM: '/images/locations/boss_room.jpg',
  COMBAT_GOBLIN: '/images/monsters/goblin.jpg',
  COMBAT_BAT: '/images/monsters/bat.jpg',
  COMBAT_SKELETON: '/images/monsters/skeleton.jpg',
  VICTORY: '/images/locations/victory.jpg',
};

export default function Home() {
  const { user, isReady, tg } = useTelegram();
  const [gameState, setGameState] = useState<GameState>({
    location: 'VILLAGE',
    hp: 100,
    max_hp: 100,
    gold: 0,
    enemy_hp: 0,
    message: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load initial state
  useEffect(() => {
    if (isReady && user) {
      console.log('Telegram User:', user);
      handleAction('init');
    } else if (isReady && !user) {
      console.warn('No Telegram user found. Running in browser mode.');
      // Kreiraj test usera da bi radio i van Telegrama
      handleAction('init');
    }
  }, [isReady, user]);

  const handleAction = async (actionId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setImageLoaded(false); // Reset image load state

    if (tg) tg.HapticFeedback.impactOccurred('medium');

    console.log('🎮 Action:', actionId);
    console.log('👤 User:', user);

    // Specijalni slučaj: Zatvori Web App i vrati se u chat
    if (actionId === 'SYNC_CHAT') {
      if (tg) {
        tg.close();
      }
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: actionId, 
          user: user || { id: 12345, first_name: 'TestUser' }
        }),
      });

      const data = await response.json();
      console.log('📦 Response:', data);

      if (data.error) {
        setGameState(prev => ({ ...prev, message: data.error }));
      } else {
        setGameState({
          location: data.userStats.location || 'START',
          hp: data.userStats.hp,
          max_hp: data.userStats.max_hp,
          gold: data.userStats.gold,
          enemy_hp: data.userStats.enemy_hp || 0,
          message: data.message
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setGameState(prev => ({ ...prev, message: 'Connection error.' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtons = () => {
    const { location } = gameState;
    
    switch (location) {
      case 'START':
      case 'VILLAGE':
        return [
          { id: 'GOTO_FOREST', label: '🌲 Šuma', color: 'bg-green-700' },
          { id: 'GOTO_CAVE', label: '🕳️ Pećina', color: 'bg-purple-700' },
          { id: 'GOTO_CASTLE', label: '🏰 Zamak', color: 'bg-red-800' },
          { id: 'GOTO_TAVERN', label: '🍺 Taverna', color: 'bg-yellow-700' },
          { id: 'GOTO_WELL', label: '🕳️ Bunar', color: 'bg-blue-700' },
          { id: 'SYNC_CHAT', label: '🔄 Zatvori', color: 'bg-gray-600' }
        ];
      
      case 'FOREST':
        return [
          { id: 'GOTO_CAVE', label: '🕳️ Istraži Pećinu', color: 'bg-purple-700' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'CAVE':
        return [
          { id: 'GOTO_CRYPT', label: '⚰️ Spusti se u Kriptu', color: 'bg-red-900' },
          { id: 'GOTO_TREASURE', label: '💎 Potraži Blago', color: 'bg-yellow-600' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'CASTLE':
        return [
          { id: 'GOTO_CRYPT', label: '⚰️ Spusti se u Kriptu', color: 'bg-red-900' },
          { id: 'GOTO_BOSS', label: '🐉 Boss Arena (100💰)', color: 'bg-red-600' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'CRYPT':
        return [
          { id: 'GOTO_TREASURE', label: '💎 Potraži Blago', color: 'bg-yellow-600' },
          { id: 'GOTO_CASTLE', label: '🏰 Nazad u Zamak', color: 'bg-red-800' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'TREASURE_ROOM':
        return [
          { id: 'GOTO_CAVE', label: '🕳️ Nazad u Pećinu', color: 'bg-purple-700' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'TAVERN':
        return [
          { id: 'GOTO_VILLAGE', label: '🏘️ Izađi u Selo', color: 'bg-gray-600' },
          { id: 'RESET', label: '🔄 Nova Igra', color: 'bg-red-700' }
        ];
      
      case 'WELL':
        return [
          { id: 'GOTO_CAVE', label: '🕳️ Siđi u Pećinu', color: 'bg-purple-700' },
          { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }
        ];
      
      case 'BOSS_ROOM':
      case 'COMBAT_GOBLIN':
      case 'COMBAT_BAT':
      case 'COMBAT_SKELETON':
        return [
          { id: 'ACT_ATTACK', label: '⚔️ Napadni', color: 'bg-red-600' },
          { id: 'ACT_DEFEND', label: '🛡️ Brani se', color: 'bg-blue-600' },
          { id: 'ACT_FLEE', label: '🏃 Beži', color: 'bg-gray-600' }
        ];
      
      case 'VICTORY':
        return [
          { id: 'RESET', label: '🔄 Nova Igra', color: 'bg-green-600' }
        ];
      
      default:
        return [{ id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo', color: 'bg-gray-600' }];
    }
  };

  const getLocationIcon = () => {
    switch (gameState.location) {
      case 'START':
      case 'VILLAGE': return '🏘️';
      case 'FOREST': return '🌲';
      case 'CAVE': return '🕳️';
      case 'CASTLE': return '🏰';
      case 'CRYPT': return '⚰️';
      case 'TREASURE_ROOM': return '💎';
      case 'TAVERN': return '🍺';
      case 'WELL': return '🕳️';
      case 'BOSS_ROOM': return '🐉';
      case 'COMBAT_GOBLIN': return '🗡️';
      case 'COMBAT_BAT': return '🦇';
      case 'COMBAT_SKELETON': return '💀';
      case 'VICTORY': return '🏆';
      default: return '❓';
    }
  };

  const getCurrentImage = () => {
    // For boss room, show dragon image
    if (gameState.location === 'BOSS_ROOM') {
      return '/images/monsters/dragon.jpg';
    }
    return LOCATION_IMAGES[gameState.location] || '/images/locations/village.jpg';
  };

  return (
    <main className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Location Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={getCurrentImage()}
          alt={gameState.location}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
        
        {/* Location Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>{getLocationIcon()}</span>
            <span>{gameState.location.replace(/_/g, ' ')}</span>
          </h2>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800/90 backdrop-blur p-4 border-b border-gray-700 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{user?.first_name || 'Hero'}</span>
          <div className="flex gap-4">
            <div className="text-red-400 font-semibold">❤️ {gameState.hp}/{gameState.max_hp}</div>
            <div className="text-yellow-400 font-semibold">💰 {gameState.gold}</div>
          </div>
        </div>
        {gameState.enemy_hp > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-300">Enemy HP</span>
              <span className="text-red-300 font-bold">{gameState.enemy_hp}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gameState.enemy_hp / 100) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {gameState.message && (
          <div className="bg-gray-800/80 backdrop-blur p-4 rounded-lg border border-gray-700 shadow-xl animate-fade-in">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{gameState.message}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-900/95 backdrop-blur border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          {getButtons().map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleAction(btn.id)}
              disabled={isProcessing}
              className={`${btn.color} p-3 rounded-lg font-bold text-white active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:brightness-110`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
