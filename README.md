# 🎮 Well Dungeon - Telegram Mini App RPG

Interaktivna RPG igra sa **10+ lokacija**, **4 neprijatelja**, i **Boss Fight** sistemom!

Igra radi **identično** u **Chat-u** (inline buttons) i **Web App-u** (Mini App), sa realtime sinhronizacijom preko Supabase baze.

---

## ✨ Features

✅ **10 Jedinstvenih Lokacija:**
- 🏘️ Village (Start)
- 🌲 Forest (Random Goblin encounter)
- 🕳️ Cave (Random Bat encounter)
- 🏰 Castle
- ⚰️ Crypt (Random Skeleton encounter)
- 💎 Treasure Room (Random gold reward)
- 🍺 Taverna (Safe zone, HP restore)
- 🕳️ Well
- 🐉 Boss Room (100 Gold entry, Dragon fight)
- 🏆 Victory Screen

✅ **Combat System:**
- ⚔️ Attack (10-25 damage)
- 🛡️ Defend (50% block chance)
- 🏃 Flee (escape to village)

✅ **Enemy Types:**
- 🗡️ Goblin (30 HP, +10 Gold)
- 🦇 Giant Bat (20 HP, +10 Gold)
- 💀 Skeleton Warrior (40 HP, +10 Gold)
- 🐉 Ancient Dragon (100 HP, +200 Gold) - BOSS

✅ **Progression System:**
- 💰 Gold collection (needed for Boss fight)
- ❤️ HP tracking with death/respawn mechanic
- 🎯 Victory ending when Dragon is defeated

✅ **Dual Interface:**
- 💬 Chat Interface: Inline keyboard buttons (no typing!)
- 🎮 Web App Interface: Mini App with dynamic UI
- 🔄 Real-time Sync: Chat ⟷ Web App perfectly synchronized via Supabase

---

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TELEGRAM_BOT_TOKEN=your_bot_token
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
npx vercel --prod
```

---

## 🤖 Bot Setup

### 1. Start Local Bot Script
```bash
node final-bot.js
```

### 2. Configure Telegram Bot (BotFather)
```
/setmenubutton
- Select your bot
- Type: "web_app"
- URL: https://telegram-rpg-ten.vercel.app/
```

### 3. Test in Telegram
```
/start - Load game state from database
/play - Open Web App directly
```

---

## 🗺️ Game Flow

```
VILLAGE → FOREST/CAVE/CASTLE/WELL
   ↓
COMBAT or SAFE
   ↓
Collect Gold (5-70 per location)
   ↓
Reach 100 💰 Gold
   ↓
CASTLE → BOSS ROOM → Fight Dragon
   ↓
VICTORY! 🏆
```

**See `GAME_MAP.md` for detailed map and progression guide.**

---

## 🎨 Images (Optional Enhancement)

Trenutno igra koristi samo emoji ikone. Za vizualno poboljšanje:

1. **Generisi slike** pomoću AI (vidi `AI_IMAGE_PROMPTS.md`):
   - Koristi DALL-E, MidJourney, Leonardo.ai ili Stable Diffusion
   - Sačuvaj u `public/images/locations/` i `public/images/monsters/`

2. **Update UI** (vidi `EXAMPLE_IMAGE_INTEGRATION.js`):
   - Dodaj `LOCATION_IMAGES` dictionary
   - Render slike u `app/page.tsx`

**Fajlovi sa prompt-ovima:**
- `GAME_SCENARIOS.md` - Opisi scena
- `AI_IMAGE_PROMPTS.md` - AI prompt-ovi za svaku sliku
- `EXAMPLE_IMAGE_INTEGRATION.js` - Kod za integraciju

---

## 📂 Project Structure

```
telegram-miniapp/
├── app/
│   ├── page.tsx              # Web App UI (Next.js)
│   ├── api/
│   │   └── game/route.ts     # Game logic API
├── final-bot.js              # Telegram bot script
├── setup-webapp.js           # Menu button configurator
├── lib/
│   └── supabase-admin.ts     # Supabase client
├── public/
│   └── images/               # (Optional) Game images
│       ├── locations/
│       └── monsters/
├── GAME_MAP.md               # Mapa igre i putevi
├── AI_IMAGE_PROMPTS.md       # AI prompt-ovi za slike
└── README.md                 # Ovaj fajl
```

---

## 🔧 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend:** Vercel Edge Functions
- **Database:** Supabase (PostgreSQL)
- **Bot:** node-telegram-bot-api
- **Deployment:** Vercel

---

## 📊 Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  hp INT DEFAULT 100,
  max_hp INT DEFAULT 100,
  gold INT DEFAULT 0,
  location TEXT DEFAULT 'VILLAGE',
  enemy_hp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 How It Works

### Chat Interface (final-bot.js)
1. User clicks `/start` → Bot loads location from Supabase
2. User clicks button → `callback_query` handler updates DB
3. Bot sends new message with updated state

### Web App Interface (app/page.tsx)
1. User opens Mini App → Loads state from Supabase via `/api/game`
2. User clicks button → Sends action to `/api/game`
3. API updates Supabase **AND** sends Telegram message to chat
4. Chat receives auto-update notification!

### Synchronization
- **DB → Chat:** Bot reads location on `/start`
- **DB → Web App:** API reads state on `init` action
- **Web App → Chat:** API calls Telegram Bot API directly on state change
- **Chat → Web App:** Just refresh Web App, reads from DB

---

## 🐛 Debugging

### Bot not responding?
```bash
# Check if bot is running
ps aux | grep node

# Restart bot
node final-bot.js
```

### Web App not loading?
```bash
# Check Vercel deployment
npx vercel --prod

# Check .env.local variables
cat .env.local
```

### State not syncing?
- Check Supabase database: `SELECT * FROM users WHERE telegram_id = YOUR_ID;`
- Check bot logs: Look for `console.log` output
- Check API logs: Vercel dashboard → Logs

---

## 📝 Sledeći koraci (Optional)

1. **Dodaj slike** (vidi `AI_IMAGE_PROMPTS.md`)
2. **Dodaj inventory sistem** (weapons, armor, potions)
3. **Dodaj NPCs** (merchants, quest givers)
4. **Dodaj više lokacija** (town, dungeon levels, final castle)
5. **Dodaj PvP sistem** (player vs player battles)
6. **Dodaj leaderboard** (top players by gold/victories)

---

## 📞 Support

Created by: @gamerMVPbot  
Vercel URL: https://telegram-rpg-ten.vercel.app/

---

## 🎮 Kako igrati?

1. **Otvori bota:** [@gamerMVPbot](https://t.me/gamerMVPbot)
2. **Klikni:** `/start`
3. **Igraj:** Koristi samo dugmiće (ne kucaj poruke!)
4. **Web App:** Klikni "🎮 Web App" za full-screen iskustvo

**Cilj:** Sakupi 100 💰 Gold, uđi u Boss Room, pobedi Zmaja! 🐉

---

**Uživaj u igri!** 🏆
