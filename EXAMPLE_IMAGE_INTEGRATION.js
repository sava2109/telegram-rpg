// EXAMPLE: How to add images to the game UI

import Image from 'next/image';

// 1. Define image paths
const LOCATION_IMAGES: Record<string, string> = {
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

// 2. Use in JSX (add to page.tsx)
export default function GamePage() {
  const [gameState, setGameState] = useState({
    location: 'VILLAGE',
    hp: 100,
    gold: 0,
    // ...
  });

  return (
    <div className="game-container">
      {/* Image Display */}
      <div className="location-image">
        {LOCATION_IMAGES[gameState.location] && (
          <img 
            src={LOCATION_IMAGES[gameState.location]} 
            alt={gameState.location}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <p>❤️ HP: {gameState.hp}/{gameState.max_hp}</p>
        <p>💰 Gold: {gameState.gold}</p>
      </div>

      {/* Message */}
      <div className="message-box">
        <p>{gameState.message}</p>
      </div>

      {/* Buttons */}
      <div className="button-grid">
        {gameState.buttons.map((btn) => (
          <button 
            key={btn.id} 
            onClick={() => handleAction(btn.id)}
            className="game-button"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 3. Add CSS (globals.css)
/*
.location-image {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.location-image img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: rgba(0,0,0,0.7);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.message-box {
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  min-height: 80px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.game-button {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.game-button:hover {
  transform: scale(1.05);
}

.game-button:active {
  transform: scale(0.95);
}
*/
