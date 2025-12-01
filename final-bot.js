const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// --- KONFIGURACIJA ---
const token = '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';
const webAppUrl = 'https://telegram-rpg-ten.vercel.app/';
const supabaseUrl = 'https://fvpddcwimzaolmsxrxys.supabase.co';
const supabaseServiceKey = 'sb_secret_-GweJ3rCzFBI4-vsGMrABA_GYi3GK12';

// Image mappings (Vercel public URLs)
const LOCATION_IMAGES = {
  START: 'https://telegram-rpg-ten.vercel.app/images/locations/village.jpg',
  VILLAGE: 'https://telegram-rpg-ten.vercel.app/images/locations/village.jpg',
  FOREST: 'https://telegram-rpg-ten.vercel.app/images/locations/forest.jpg',
  CAVE: 'https://telegram-rpg-ten.vercel.app/images/locations/cave.jpg',
  CASTLE: 'https://telegram-rpg-ten.vercel.app/images/locations/castle.jpg',
  CRYPT: 'https://telegram-rpg-ten.vercel.app/images/locations/crypt.jpg',
  TREASURE_ROOM: 'https://telegram-rpg-ten.vercel.app/images/locations/treasure.jpg',
  TAVERN: 'https://telegram-rpg-ten.vercel.app/images/locations/tavern.jpg',
  WELL: 'https://telegram-rpg-ten.vercel.app/images/locations/well.jpg',
  BOSS_ROOM: 'https://telegram-rpg-ten.vercel.app/images/monsters/dragon.jpg',
  COMBAT_GOBLIN: 'https://telegram-rpg-ten.vercel.app/images/monsters/goblin.jpg',
  COMBAT_BAT: 'https://telegram-rpg-ten.vercel.app/images/monsters/bat.jpg',
  COMBAT_SKELETON: 'https://telegram-rpg-ten.vercel.app/images/monsters/skeleton.jpg',
  VICTORY: 'https://telegram-rpg-ten.vercel.app/images/locations/victory.jpg',
};

// --- INICIJALIZACIJA ---
const bot = new TelegramBot(token, { polling: true });
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 RPG Bot (Supabase Sync) se pokreće...');

// Provera webhooks i pokreni polling
(async () => {
  try {
    await bot.deleteWebHook();
    console.log('✅ Webhook obrisan. Polling mode aktivan.');
  } catch (e) {
    console.error('Webhook delete error:', e.message);
  }
})();

// --- LOGIKA IGRE ---

async function getUserFromDB(telegramId) {
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();
  
  if (!user) {
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramId,
        hp: 100,
        max_hp: 100,
        gold: 0,
        location: 'START',
        enemy_hp: 0
      })
      .select()
      .single();
    user = newUser;
  }
  
  return user;
}

async function updateUserInDB(telegramId, updates) {
  await supabase
    .from('users')
    .update(updates)
    .eq('telegram_id', telegramId);
}

async function sendGameState(chatId, telegramId, stateKey = null, messageOverride = null, messageIdToDelete = null) {
  // 1. Učitaj korisnika iz baze
  const user = await getUserFromDB(telegramId);
  const currentLocation = stateKey || user.location || 'START';
  
  // NE BRIŠEMO STARU PORUKU - Ostavljamo history u chat-u!

  let text = '';
  let buttons = [];
  let imageUrl = LOCATION_IMAGES[currentLocation] || LOCATION_IMAGES['VILLAGE'];

  // 3. Definiši sadržaj
  switch (currentLocation) {
    case 'START':
    case 'VILLAGE':
      text = messageOverride || `🏘️ *Village*\n\nA peaceful village. People go about their business.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '🌲 Forest', callback_data: 'GOTO_FOREST' }, { text: '🕳️ Cave', callback_data: 'GOTO_CAVE' }],
        [{ text: '🏰 Castle', callback_data: 'GOTO_CASTLE' }, { text: '🍺 Tavern', callback_data: 'GOTO_TAVERN' }],
        [{ text: '🕳️ Well', callback_data: 'GOTO_WELL' }],
        [{ text: '🎮 Web App', web_app: { url: webAppUrl } }]
      ];
      break;

    case 'FOREST':
      text = messageOverride || `🌲 *Dark Forest*\n\nDense forest surrounds you.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '🕳️ Explore Cave', callback_data: 'GOTO_CAVE' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'CAVE':
      text = messageOverride || `🕳️ *Cave*\n\nDamp cave. You hear echoes.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '⚰️ Descend to Crypt', callback_data: 'GOTO_CRYPT' }],
        [{ text: '💎 Search for Treasure', callback_data: 'GOTO_TREASURE' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'CASTLE':
      text = messageOverride || `🏰 *Abandoned Castle*\n\nOld stone castle.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '⚰️ Descend to Crypt', callback_data: 'GOTO_CRYPT' }],
        [{ text: '🐉 Boss Arena (100💰)', callback_data: 'GOTO_BOSS' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'CRYPT':
      text = messageOverride || `⚰️ *Crypt*\n\nCoffins everywhere. Runes glow.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '💎 Search for Treasure', callback_data: 'GOTO_TREASURE' }],
        [{ text: '🏰 Back to Castle', callback_data: 'GOTO_CASTLE' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'TREASURE_ROOM':
      text = messageOverride || `💎 *Treasure Room!*\n\nGold gleams!\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '🕳️ Back to Cave', callback_data: 'GOTO_CAVE' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'TAVERN':
      text = messageOverride || `🍺 *Tavern*\n\nWarm tavern. A safe place.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '🏘️ Go to Village', callback_data: 'GOTO_VILLAGE' }],
        [{ text: '🔄 New Game', callback_data: 'RESET' }]
      ];
      break;

    case 'WELL':
      text = messageOverride || `🕳️ *Deep Well*\n\nStairs lead down.\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '🕳️ Descend to Cave', callback_data: 'GOTO_CAVE' }],
        [{ text: '🏘️ Back to Village', callback_data: 'GOTO_VILLAGE' }]
      ];
      break;

    case 'BOSS_ROOM':
    case 'COMBAT_GOBLIN':
    case 'COMBAT_BAT':
    case 'COMBAT_SKELETON':
      const enemyName = currentLocation === 'BOSS_ROOM' ? '🐉 Dragon' : 
                        currentLocation === 'COMBAT_GOBLIN' ? '🗡️ Goblin' :
                        currentLocation === 'COMBAT_BAT' ? '🦇 Giant Bat' : '💀 Skeleton';
      text = messageOverride || `⚔️ *COMBAT!*\n\n${enemyName} (${user.enemy_hp} HP)\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [
        [{ text: '⚔️ Attack', callback_data: 'ACT_ATTACK' }],
        [{ text: '🛡️ Defend', callback_data: 'ACT_DEFEND' }, { text: '🏃 Flee', callback_data: 'ACT_FLEE' }]
      ];
      break;

    case 'VICTORY':
      text = messageOverride || `🏆 *VICTORY!*\n\nYou've completed the game!\n\n💰 Gold: ${user.gold}`;
      buttons = [
        [{ text: '🔄 New Game', callback_data: 'RESET' }]
      ];
      break;

    default:
      text = messageOverride || `🏘️ Returning you to the village...\n\n💰 Gold: ${user.gold} | ❤️ HP: ${user.hp}/${user.max_hp}`;
      buttons = [[{ text: '🏘️ Village', callback_data: 'GOTO_VILLAGE' }]];
      break;
  }

  // 4. Pošalji poruku SA SLIKOM!
  try {
    // Prvo pošalji sliku
    await bot.sendPhoto(chatId, imageUrl, {
      caption: text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (e) {
    console.error('Send photo error:', e.message);
    // Fallback: pošalji bez slike ako slika ne radi
    try {
      await bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: buttons
        }
      });
    } catch (err) {
      console.error('Send message error:', err.message);
    }
  }
}

// --- HANDLERS ---

// 1. Callback Query (Klik na dugme)
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const telegramId = query.from.id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  const user = await getUserFromDB(telegramId);

  // === NAVIGATION ===
  if (data === 'GOTO_VILLAGE') {
    await updateUserInDB(telegramId, { location: 'VILLAGE' });
    return sendGameState(chatId, telegramId, 'VILLAGE');
  }
  
  if (data === 'GOTO_FOREST') {
    if (Math.random() > 0.6) {
      await updateUserInDB(telegramId, { location: 'COMBAT_GOBLIN', enemy_hp: 30 });
      return sendGameState(chatId, telegramId, 'COMBAT_GOBLIN', '⚠️ *WATCH OUT!* A Goblin jumps from the bushes!\n\n🗡️ Goblin (30 HP)');
    } else {
      await updateUserInDB(telegramId, { location: 'FOREST', gold: user.gold + 5 });
      return sendGameState(chatId, telegramId, 'FOREST');
    }
  }

  if (data === 'GOTO_CAVE') {
    if (Math.random() > 0.7) {
      await updateUserInDB(telegramId, { location: 'COMBAT_BAT', enemy_hp: 20 });
      return sendGameState(chatId, telegramId, 'COMBAT_BAT', '⚠️ *WATCH OUT!* Giant bats attack!\n\n🦇 Giant Bat (20 HP)');
    } else {
      await updateUserInDB(telegramId, { location: 'CAVE' });
      return sendGameState(chatId, telegramId, 'CAVE');
    }
  }

  if (data === 'GOTO_CASTLE') {
    await updateUserInDB(telegramId, { location: 'CASTLE' });
    return sendGameState(chatId, telegramId, 'CASTLE');
  }

  if (data === 'GOTO_CRYPT') {
    if (Math.random() > 0.5) {
      await updateUserInDB(telegramId, { location: 'COMBAT_SKELETON', enemy_hp: 40 });
      return sendGameState(chatId, telegramId, 'COMBAT_SKELETON', '⚠️ *WATCH OUT!* A skeleton comes to life!\n\n💀 Skeleton Warrior (40 HP)');
    } else {
      await updateUserInDB(telegramId, { location: 'CRYPT' });
      return sendGameState(chatId, telegramId, 'CRYPT');
    }
  }

  if (data === 'GOTO_TREASURE') {
    const treasureGold = Math.floor(Math.random() * 50) + 20;
    await updateUserInDB(telegramId, { location: 'TREASURE_ROOM', gold: user.gold + treasureGold });
    return sendGameState(chatId, telegramId, 'TREASURE_ROOM', `💎 *Treasure Room!*\n\nYou found a treasure chest! (+${treasureGold} 💰 Gold)`);
  }

  if (data === 'GOTO_TAVERN') {
    await updateUserInDB(telegramId, { location: 'TAVERN', hp: user.max_hp });
    return sendGameState(chatId, telegramId, 'TAVERN');
  }

  if (data === 'GOTO_WELL') {
    await updateUserInDB(telegramId, { location: 'WELL' });
    return sendGameState(chatId, telegramId, 'WELL');
  }

  if (data === 'GOTO_BOSS') {
    if (user.gold >= 100) {
      await updateUserInDB(telegramId, { location: 'BOSS_ROOM', enemy_hp: 100 });
      return sendGameState(chatId, telegramId, 'BOSS_ROOM', '🐉 *BOSS FIGHT!*\n\nA massive dragon blocks the path!\n\n🔥 Ancient Dragon (100 HP)');
    } else {
      return sendGameState(chatId, telegramId, user.location, '⚠️ You need 100 💰 Gold to enter the Boss room!');
    }
  }

  // === COMBAT ===
  if (data === 'ACT_ATTACK') {
    if (user.location.startsWith('COMBAT') || user.location === 'BOSS_ROOM') {
      const dmg = Math.floor(Math.random() * 15) + 10;
      const enemyDmg = Math.floor(Math.random() * 10) + 5;
      const newEnemyHp = Math.max(0, user.enemy_hp - dmg);
      
      if (newEnemyHp <= 0) {
        // Victory!
        let reward = 10;
        let nextLocation = 'VILLAGE';
        let victoryMsg = '';
        
        if (user.location === 'BOSS_ROOM') {
          reward = 200;
          nextLocation = 'VICTORY';
          victoryMsg = `🏆 *EPIC VICTORY!*\n\nYou slayed the Dragon! The kingdom is free!\n\n💰 +${reward} Gold\n\n🎉 GAME COMPLETED!`;
        } else {
          victoryMsg = `🏆 *VICTORY!*\n\nYou defeated the enemy! (+${reward} 💰 Gold)`;
        }
        
        await updateUserInDB(telegramId, { location: nextLocation, enemy_hp: 0, gold: user.gold + reward });
        return sendGameState(chatId, telegramId, nextLocation, victoryMsg);
      } else {
        const newHp = Math.max(0, user.hp - enemyDmg);
        
        if (newHp <= 0) {
          await updateUserInDB(telegramId, { location: 'TAVERN', hp: user.max_hp, enemy_hp: 0 });
          return sendGameState(chatId, telegramId, 'TAVERN', `💀 *DEFEATED!*\n\nThe enemy has defeated you!\n\n🍺 You woke up in the Tavern with full HP.`);
        } else {
          await updateUserInDB(telegramId, { enemy_hp: newEnemyHp, hp: newHp });
          return sendGameState(chatId, telegramId, user.location, `⚔️ You dealt *${dmg}* damage!\n❤️ You took *${enemyDmg}* damage!\n\n🗡️ Enemy: ${newEnemyHp} HP\n❤️ You: ${newHp} HP`);
        }
      }
    }
  }

  if (data === 'ACT_DEFEND') {
    const blockChance = Math.random();
    if (blockChance > 0.5) {
      return sendGameState(chatId, telegramId, user.location, `🛡️ You successfully blocked the attack!`);
    } else {
      const dmg = Math.floor(Math.random() * 5) + 2;
      const newHp = Math.max(0, user.hp - dmg);
      await updateUserInDB(telegramId, { hp: newHp });
      return sendGameState(chatId, telegramId, user.location, `🛡️ Partially blocked!\n❤️ You took ${dmg} damage. (HP: ${newHp})`);
    }
  }

  if (data === 'ACT_FLEE') {
    await updateUserInDB(telegramId, { location: 'VILLAGE', enemy_hp: 0 });
    return sendGameState(chatId, telegramId, 'VILLAGE', '🏃 You fled! You returned to the village.');
  }
  
  // === RESET ===
  if (data === 'RESET') {
    await updateUserInDB(telegramId, { location: 'VILLAGE', hp: 100, gold: 0, enemy_hp: 0 });
    return sendGameState(chatId, telegramId, 'VILLAGE', '♻️ *New Adventure!*\n\n🏘️ You started over in the village.');
  }
});

// 2. Start komanda
bot.onText(/\/start/, async (msg) => {
  const telegramId = msg.from.id;
  const user = await getUserFromDB(telegramId); // Load user from DB
  
  // Učitaj trenutnu lokaciju iz baze
  const currentLocation = user.location || 'START';
  
  console.log(`📍 User ${telegramId} loaded from DB: location=${currentLocation}`);
  
  sendGameState(msg.chat.id, telegramId, currentLocation);
});

// 3. Play komanda (direktan Web App link)
bot.onText(/\/play/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🎮 *Open Well Dungeon Web App:*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🎮 PLAY NOW', web_app: { url: webAppUrl } }
      ]]
    }
  });
});

// 3. Blokiraj tekstualne poruke
bot.on('message', (msg) => {
  if (msg.text && (msg.text === '/start' || msg.text === '/play')) return;
  
  if (msg.text) {
    bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => {});
    
    bot.sendMessage(msg.chat.id, '⚠️ Use only the buttons below messages!', {
      reply_markup: { remove_keyboard: true }
    }).then(sentMsg => {
      setTimeout(() => {
        bot.deleteMessage(msg.chat.id, sentMsg.message_id).catch(() => {});
      }, 2000);
    });
  }
});

// --- POKRETANJE ---
bot.deleteWebHook().then(() => {
  console.log('✅ Webhook obrisan. Pokrećem polling...');
  bot.startPolling();
});

bot.on('polling_error', (error) => {
  console.log('Polling error (ignorable):', error.code);
});
