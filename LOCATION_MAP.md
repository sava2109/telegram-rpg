# 🗺️ MAPA LOKACIJA - Šta vodi na šta

## 🏘️ VILLAGE (Selo - START)
**Opis:** Mirno selo, glavna hub lokacija  
**Može da ide u:**
- 🌲 FOREST (Šuma)
- 🕳️ CAVE (Pećina)
- 🏰 CASTLE (Zamak)
- 🍺 TAVERN (Taverna)
- 🕳️ WELL (Bunar)

**Slika:** `village.jpg` → Mirno srednjevekovno selo sa fontanom

---

## 🌲 FOREST (Šuma)
**Opis:** Mračna šuma sa šansom za Goblin napad  
**Random Event:**
- 60% šansa → COMBAT sa Goblinom (30 HP)
- 40% šansa → Mirno (+5 Gold)

**Može da ide u:**
- 🕳️ CAVE (Istraži pećinu)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `forest.jpg` → Gusta mračna šuma sa maglom

---

## 🕳️ CAVE (Pećina)
**Opis:** Vlažna pećina sa kristalima  
**Random Event:**
- 30% šansa → COMBAT sa Giant Bat (20 HP)
- 70% šansa → Mirno

**Može da ide u:**
- ⚰️ CRYPT (Spusti se u kriptu)
- 💎 TREASURE_ROOM (Potraži blago)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `cave.jpg` → Pećina sa stalagmitima i kristalima

---

## 🏰 CASTLE (Zamak)
**Opis:** Napušteni kameni zamak  
**Može da ide u:**
- ⚰️ CRYPT (Spusti se u kriptu)
- 🐉 BOSS_ROOM (Boss Arena - treba 100 Gold!)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `castle.jpg` → Gotički zamak sa razrušenim zidovima

---

## ⚰️ CRYPT (Kripta)
**Opis:** Podzemna kripta  
**Random Event:**
- 50% šansa → COMBAT sa Skeletonom (40 HP)
- 50% šansa → Mirno

**Može da ide u:**
- 💎 TREASURE_ROOM (Potraži blago)
- 🏰 CASTLE (Nazad u zamak)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `crypt.jpg` → Kripta sa kovčezima i runama

---

## 💎 TREASURE_ROOM (Riznica)
**Opis:** Soba sa blagom  
**Auto Event:** +20-70 Gold (random)

**Može da ide u:**
- 🕳️ CAVE (Nazad u pećinu)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `treasure.jpg` → Zlato, dragulje, škrinje

---

## 🍺 TAVERN (Taverna)
**Opis:** Sigurna zona, restoruje HP  
**Auto Event:** HP → MAX (100)

**Može da ide u:**
- 🏘️ VILLAGE (Izađi u selo)
- 🔄 RESET (Nova igra)

**Slika:** `tavern.jpg` → Topla taverna sa kaminom

---

## 🕳️ WELL (Bunar)
**Opis:** Duboki bunar  
**Može da ide u:**
- 🕳️ CAVE (Siđi u pećinu)
- 🏘️ VILLAGE (Nazad u selo)

**Slika:** `well.jpg` → Bunar sa spiralnim stepenicama

---

## 🐉 BOSS_ROOM (Boss Arena)
**Opis:** Arena sa Zmajem  
**Entry Cost:** 100 💰 Gold  
**Enemy:** Ancient Dragon (100 HP, +200 Gold reward)

**Ishod:**
- Pobeda → VICTORY
- Smrt → TAVERN (respawn)

**Slika:** `boss_room.jpg` → Arena sa kostima i mračnim oltarom

---

## 🏆 VICTORY (Pobeda)
**Opis:** Završna slika - Pobedio si igru!  
**Može da ide u:**
- 🔄 RESET (Nova igra)

**Slika:** `victory.jpg` → Heroj na planini, sunce

---

## ⚔️ COMBAT SCREENS

### COMBAT_GOBLIN (Borba sa Goblinom)
**Neprijatelj:** Goblin (30 HP)  
**Reward:** +10 Gold  
**Akcije:** Napadni / Brani se / Beži  
**Slika čudovišta:** `goblin.jpg`

### COMBAT_BAT (Borba sa Slepim Mišem)
**Neprijatelj:** Giant Bat (20 HP)  
**Reward:** +10 Gold  
**Akcije:** Napadni / Brani se / Beži  
**Slika čudovišta:** `bat.jpg`

### COMBAT_SKELETON (Borba sa Kosturom)
**Neprijatelj:** Skeleton Warrior (40 HP)  
**Reward:** +10 Gold  
**Akcije:** Napadni / Brani se / Beži  
**Slika čudovišta:** `skeleton.jpg`

### COMBAT (BOSS) - Dragon
**Neprijatelj:** Ancient Dragon (100 HP)  
**Reward:** +200 Gold + VICTORY  
**Akcije:** Napadni / Brani se / Beži  
**Slika čudovišta:** `dragon.jpg`

---

## 🎯 OPTIMALAN PUT DO POBEDE

1. START → **VILLAGE**
2. **VILLAGE** → **FOREST** (farm Goblins, +10 Gold svaki)
3. **FOREST** → **CAVE** → **TREASURE_ROOM** (+20-70 Gold)
4. **CAVE** → **CRYPT** (fight Skeletons, +10 Gold)
5. Ponavljaj dok ne sakupiš **100 💰 Gold**
6. **VILLAGE** → **CASTLE** → **BOSS_ROOM**
7. Pobedi **Zmaja** → **VICTORY!** 🏆

---

## 📊 GOLD EKONOMIJA

| Akcija | Gold Reward |
|--------|-------------|
| Forest (bez borbe) | +5 |
| Pobedi Goblina | +10 |
| Pobedi Bat-a | +10 |
| Pobedi Skeletona | +10 |
| Treasure Room | +20 do +70 |
| Pobedi Zmaja | +200 |

**Minimum za Boss:** 100 Gold  
**Prosečno poseta:** 8-12 lokacija

---

## 🎨 PRIORITET ZA SLIKE

**TIER 1 (MUST HAVE):**
1. village.jpg (glavna hub lokacija)
2. forest.jpg (prva avantura)
3. goblin.jpg (prvi neprijatelj)
4. dragon.jpg (boss)
5. boss_room.jpg (boss arena)

**TIER 2 (IMPORTANT):**
6. cave.jpg (dungeon atmosfera)
7. tavern.jpg (safe zone)
8. skeleton.jpg (jači neprijatelj)
9. treasure.jpg (nagrada)

**TIER 3 (NICE TO HAVE):**
10. castle.jpg
11. crypt.jpg
12. well.jpg
13. bat.jpg
14. victory.jpg

---

**Kad završiš slike, javi! Integrisaću ih u UI odmah! 🎮**
