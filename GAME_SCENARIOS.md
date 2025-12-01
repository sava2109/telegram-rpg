# 🎮 Well Dungeon - Scenariji za Slike (10 Lokacija)

## 1. START - Ulaz u Dungeon
**Opis**: Tamna kapija kamenog dungeon-a, svetlost prodire kroz pukotine, mistična atmosfera
**Prompt**: "Ancient stone dungeon entrance with heavy wooden doors, torches on walls, mysterious fog, dark fantasy art style"
**Dimenzije**: 800x600px
**Fajl**: `start.jpg`

---

## 2. VILLAGE - Selo
**Opis**: Mirno srednjevekovno selo sa kućama, trgom, fountain
**Prompt**: "Medieval fantasy village with small houses, marketplace, fountain in center, peaceful atmosphere, sunset lighting"
**Dimenzije**: 800x600px
**Fajl**: `village.jpg`

---

## 3. FOREST - Mračna Šuma
**Opis**: Gusta šuma sa visokim stablima, magla između drveća, misteriozno
**Prompt**: "Dense dark forest with tall ancient trees, fog between trunks, mysterious atmosphere, moonlight filtering through leaves"
**Dimenzije**: 800x600px
**Fajl**: `forest.jpg`

---

## 4. CAVE - Pećina
**Opis**: Vlažna kamena pećina, stalagmiti, svetlucavi kristali
**Prompt**: "Dark cave interior with stalactites and stalagmites, glowing crystals on walls, water dripping, fantasy dungeon atmosphere"
**Dimenzije**: 800x600px
**Fajl**: `cave.jpg`

---

## 5. CASTLE - Napušteni Zamak
**Opis**: Stari kameni zamak, razrušeni zidovi, gotička arhitektura
**Prompt**: "Abandoned gothic castle ruins, crumbling stone walls, dark towers, ominous sky, medieval fantasy architecture"
**Dimenzije**: 800x600px
**Fajl**: `castle.jpg`

---

## 6. CRYPT - Kripta
**Opis**: Podzemna kripta sa kovčezima, lobanje na zidovima, mistične rune
**Prompt**: "Underground crypt with stone coffins, skulls on walls, glowing mystical runes, eerie green light, dark fantasy"
**Dimenzije**: 800x600px
**Fajl**: `crypt.jpg`

---

## 7. TREASURE_ROOM - Riznica
**Opis**: Soba puna zlata, dragulja, svetlucavi predmeti
**Prompt**: "Treasure room filled with gold coins, jewels, ancient artifacts, glowing magical items, fantasy dungeon loot"
**Dimenzije**: 800x600px
**Fajl**: `treasure.jpg`

---

## 8. BOSS_ROOM - Boss Arena
**Opis**: Velika arena sa kosturima, oružjem na zidovima, epicenter za boss fight
**Prompt**: "Large stone arena chamber, bones scattered on floor, weapons on walls, dark altar in center, boss battle atmosphere"
**Dimenzije**: 800x600px
**Fajl**: `boss_room.jpg`

---

## 9. TAVERN - Taverna (Safe Zone)
**Opis**: Topla taverna, kamin, drveni stolovi, sigurna zona
**Prompt**: "Cozy medieval tavern interior, wooden tables, fireplace, warm lighting, fantasy inn atmosphere, safe haven"
**Dimenzije**: 800x600px
**Fajl**: `tavern.jpg`

---

## 10. WELL - Bunar (Glavni Dungeon Ulaz)
**Opis**: Duboki kameni bunar, spiralne stepenice, voda na dnu
**Prompt**: "Deep stone well entrance, spiral staircase going down, dark water at bottom, torch light, ominous dungeon entrance"
**Dimenzije**: 800x600px
**Fajl**: `well.jpg`

---

## BONUS Slike (Čudovišta & Eventi)

### GOBLIN - Goblin
**Prompt**: "Goblin warrior with rusty sword and wooden shield, green skin, red eyes, aggressive pose, fantasy RPG character"
**Fajl**: `goblin.jpg`

### ORC - Ork
**Prompt**: "Large orc warrior with battle axe, muscular build, armor, fierce expression, dark fantasy character"
**Fajl**: `orc.jpg`

### SKELETON - Kostur
**Prompt**: "Undead skeleton warrior with sword, glowing eyes, tattered cloth, dark fantasy enemy"
**Fajl**: `skeleton.jpg`

### DRAGON - Zmaj (Boss)
**Prompt**: "Massive dragon with red scales, breathing fire, wings spread, epic boss character, dark fantasy"
**Fajl**: `dragon.jpg`

### MERCHANT - Trgovac
**Prompt**: "Friendly merchant NPC with robes, selling potions and items, fantasy RPG character"
**Fajl**: `merchant.jpg`

---

## Kako da generiši slike:

1. **AI Generator (Besplatno)**:
   - MidJourney (Discord)
   - DALL-E 3 (ChatGPT)
   - Leonardo.ai
   - Stable Diffusion (local)

2. **Ili Stock Images**:
   - Unsplash (besplatno)
   - Pexels (besplatno)
   - ArtStation (reference)

3. **Sačuvaj u**:
   - `public/images/locations/` (za Next.js)
   - Ili koristi Imgur/Cloudinary za hosting

---

## Format za korišćenje u kodu:

```javascript
const IMAGES = {
  START: '/images/locations/start.jpg',
  VILLAGE: '/images/locations/village.jpg',
  FOREST: '/images/locations/forest.jpg',
  CAVE: '/images/locations/cave.jpg',
  CASTLE: '/images/locations/castle.jpg',
  CRYPT: '/images/locations/crypt.jpg',
  TREASURE_ROOM: '/images/locations/treasure.jpg',
  BOSS_ROOM: '/images/locations/boss_room.jpg',
  TAVERN: '/images/locations/tavern.jpg',
  WELL: '/images/locations/well.jpg',
  
  // Monsters
  GOBLIN: '/images/monsters/goblin.jpg',
  ORC: '/images/monsters/orc.jpg',
  SKELETON: '/images/monsters/skeleton.jpg',
  DRAGON: '/images/monsters/dragon.jpg'
};
```
