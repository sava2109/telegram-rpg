# 🗺️ Well Dungeon - Mapa Igre

## 📍 Lokacije i Putevi

```
           [START]
              |
              ↓
          [VILLAGE] ⟷ [TAVERN] (Safe Zone, HP Restore)
           /  |  \
          /   |   \
         /    |    \
    FOREST CAVE CASTLE WELL
        |     |      |     |
        |     |      |     |
        |  CRYPT ⟷ CASTLE  |
        |     |      |     |
        |  TREASURE  |     |
         \    |     /      |
          \   |    /       |
           \  |   /        |
            VILLAGE ⟷ BOSS_ROOM (100 💰)
                |
                ↓
            [VICTORY]
```

---

## 🎮 Gameplay Flow

### START / VILLAGE (Centralno mesto)
- **Odavde možeš ići u:**
  - 🌲 Šuma (chance za Goblin fight)
  - 🕳️ Pećina (chance za Bat fight)
  - 🏰 Zamak (safe)
  - 🍺 Taverna (heal HP)
  - 🕳️ Bunar (safe)

### FOREST (Šuma)
- **Random Event:**
  - 60% šansa: COMBAT sa Goblinom (30 HP, +10 Gold)
  - 40% šansa: Mirno, +5 Gold
- **Exit:** Nazad u Selo ili Pećina

### CAVE (Pećina)
- **Random Event:**
  - 30% šansa: COMBAT sa Giant Bat (20 HP, +10 Gold)
  - 70% šansa: Mirno
- **Destinations:**
  - ⚰️ Kripta (chance za Skeleton)
  - 💎 Riznica (Gold reward)
  - 🏘️ Nazad u Selo

### CASTLE (Zamak)
- **Safe Location**
- **Destinations:**
  - ⚰️ Kripta
  - 🐉 Boss Arena (needs 100 Gold)
  - 🏘️ Nazad u Selo

### CRYPT (Kripta)
- **Random Event:**
  - 50% šansa: COMBAT sa Skeleton (40 HP, +10 Gold)
  - 50% šansa: Mirno
- **Destinations:**
  - 💎 Riznica
  - 🏰 Zamak
  - 🏘️ Selo

### TREASURE_ROOM (Riznica)
- **Auto Reward:** +20-70 Gold (random)
- **Exit:** Pećina ili Selo

### TAVERN (Taverna)
- **Safe Zone:** HP restored to MAX
- **Exit:** Selo
- **Special:** Nova Igra (Reset)

### WELL (Bunar)
- **Safe Location**
- **Destinations:**
  - 🕳️ Pećina
  - 🏘️ Selo

### BOSS_ROOM (Boss Arena)
- **Entry Cost:** 100 💰 Gold
- **Enemy:** Ancient Dragon (100 HP)
- **Reward:** 200 Gold + VICTORY
- **On Death:** Respawn u Taverni

### VICTORY (Kraj Igre)
- **Ending Screen**
- **Option:** Nova Igra (Reset)

---

## ⚔️ Combat System

### Damage:
- **Player Attack:** 10-25 damage
- **Enemy Attack:** 5-15 damage

### Actions:
- ⚔️ **Napadni** - Deal damage, receive counter-attack
- 🛡️ **Brani se** - 50% block chance, reduced damage
- 🏃 **Beži** - Return to Village (flee combat)

### Death:
- Player HP = 0 → Respawn u Taverni sa punim HP
- Enemy HP = 0 → Victory, Gold reward

---

## 🎯 Progression Path (Recommended)

1. **START** → VILLAGE
2. **VILLAGE** → FOREST (farm +5 Gold, fight Goblins)
3. **VILLAGE** → CAVE → TREASURE (+20-70 Gold)
4. **CAVE** → CRYPT (fight Skeletons for more Gold)
5. **Collect 100 Gold total**
6. **CASTLE** → BOSS_ROOM (Fight Dragon)
7. **VICTORY!** 🏆

---

## 💰 Gold Economy

| Action | Gold Reward |
|--------|------------|
| Find mushrooms (Forest) | +5 |
| Defeat Goblin | +10 |
| Defeat Bat | +10 |
| Defeat Skeleton | +10 |
| Treasure Room | +20-70 (random) |
| Defeat Dragon (Boss) | +200 |

**Total needed for Boss:** 100 Gold  
**Estimated runs:** 5-10 locations visited

---

## 🖼️ Slike koje treba da napraviš:

Sačuvaj slike u `public/images/locations/`:

1. `village.jpg` - Mirno srednjevekovno selo
2. `forest.jpg` - Mračna šuma sa maglom
3. `cave.jpg` - Vlažna pećina sa kristalima
4. `castle.jpg` - Napušteni kameni zamak
5. `crypt.jpg` - Podzemna kripta sa kovčezima
6. `treasure.jpg` - Soba puna zlata i dragulja
7. `tavern.jpg` - Topla taverna sa kaminom
8. `well.jpg` - Duboki bunar sa stepenicama
9. `boss_room.jpg` - Arena sa zmajom
10. `victory.jpg` - Pobednička slika

Plus čudovišta u `public/images/monsters/`:
- `goblin.jpg`
- `bat.jpg`
- `skeleton.jpg`
- `dragon.jpg`

---

## 🎨 UI Implementation (Next Step)

Kada uploaduješ slike, moraš update `app/page.tsx`:

```typescript
const LOCATION_IMAGES = {
  VILLAGE: '/images/locations/village.jpg',
  FOREST: '/images/locations/forest.jpg',
  CAVE: '/images/locations/cave.jpg',
  CASTLE: '/images/locations/castle.jpg',
  CRYPT: '/images/locations/crypt.jpg',
  TREASURE_ROOM: '/images/locations/treasure.jpg',
  TAVERN: '/images/locations/tavern.jpg',
  WELL: '/images/locations/well.jpg',
  BOSS_ROOM: '/images/locations/boss_room.jpg',
  VICTORY: '/images/locations/victory.jpg',
};
```

I render:
```jsx
<img src={LOCATION_IMAGES[gameState.location]} alt={gameState.location} />
```
