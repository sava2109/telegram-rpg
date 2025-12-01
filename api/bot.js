const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

const token = process.env.TELEGRAM_BOT_TOKEN || '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';
const webAppUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://telegram-rpg-ten.vercel.app/';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvpddcwimzaolmsxrxys.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_-GweJ3rCzFBI4-vsGMrABA_GYi3GK12';

const bot = new TelegramBot(token);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Image mappings
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

async function sendGameState(chatId, telegramId, stateKey = null, messageOverride = null) {
  const user = await getUserFromDB(telegramId);
  const currentLocation = stateKey || user.location || 'START';

  let text = '';
  let buttons = [];
  let imageUrl = LOCATION_IMAGES[currentLocation] || LOCATION_IMAGES['VILLAGE'];

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

  await bot.sendPhoto(chatId, imageUrl, {
    caption: text,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

// Webhook handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { message, callback_query } = req.body;

    // Handle callback queries (button clicks)
    if (callback_query) {
      const chatId = callback_query.message.chat.id;
      const telegramId = callback_query.from.id;
      const data = callback_query.data;

      await bot.answerCallbackQuery(callback_query.id);
      const user = await getUserFromDB(telegramId);

      // Navigation
      if (data === 'GOTO_VILLAGE') {
        await updateUserInDB(telegramId, { location: 'VILLAGE' });
        await sendGameState(chatId, telegramId, 'VILLAGE');
      } else if (data === 'GOTO_FOREST') {
        if (Math.random() > 0.6) {
          await updateUserInDB(telegramId, { location: 'COMBAT_GOBLIN', enemy_hp: 30 });
          await sendGameState(chatId, telegramId, 'COMBAT_GOBLIN', '⚠️ *WATCH OUT!* A Goblin jumps from the bushes!\n\n🗡️ Goblin (30 HP)');
        } else {
          await updateUserInDB(telegramId, { location: 'FOREST', gold: user.gold + 5 });
          await sendGameState(chatId, telegramId, 'FOREST');
        }
      } else if (data === 'GOTO_CAVE') {
        if (Math.random() > 0.7) {
          await updateUserInDB(telegramId, { location: 'COMBAT_BAT', enemy_hp: 20 });
          await sendGameState(chatId, telegramId, 'COMBAT_BAT', '⚠️ *WATCH OUT!* Giant bats attack!\n\n🦇 Giant Bat (20 HP)');
        } else {
          await updateUserInDB(telegramId, { location: 'CAVE' });
          await sendGameState(chatId, telegramId, 'CAVE');
        }
      } else if (data === 'GOTO_CASTLE') {
        await updateUserInDB(telegramId, { location: 'CASTLE' });
        await sendGameState(chatId, telegramId, 'CASTLE');
      } else if (data === 'GOTO_CRYPT') {
        if (Math.random() > 0.5) {
          await updateUserInDB(telegramId, { location: 'COMBAT_SKELETON', enemy_hp: 40 });
          await sendGameState(chatId, telegramId, 'COMBAT_SKELETON', '⚠️ *WATCH OUT!* A skeleton comes to life!\n\n💀 Skeleton Warrior (40 HP)');
        } else {
          await updateUserInDB(telegramId, { location: 'CRYPT' });
          await sendGameState(chatId, telegramId, 'CRYPT');
        }
      } else if (data === 'GOTO_TREASURE') {
        const treasureGold = Math.floor(Math.random() * 50) + 20;
        await updateUserInDB(telegramId, { location: 'TREASURE_ROOM', gold: user.gold + treasureGold });
        await sendGameState(chatId, telegramId, 'TREASURE_ROOM', `💎 *Treasure Room!*\n\nYou found a treasure chest! (+${treasureGold} 💰 Gold)`);
      } else if (data === 'GOTO_TAVERN') {
        await updateUserInDB(telegramId, { location: 'TAVERN', hp: user.max_hp });
        await sendGameState(chatId, telegramId, 'TAVERN');
      } else if (data === 'GOTO_WELL') {
        await updateUserInDB(telegramId, { location: 'WELL' });
        await sendGameState(chatId, telegramId, 'WELL');
      } else if (data === 'GOTO_BOSS') {
        if (user.gold >= 100) {
          await updateUserInDB(telegramId, { location: 'BOSS_ROOM', enemy_hp: 100 });
          await sendGameState(chatId, telegramId, 'BOSS_ROOM', '🐉 *BOSS FIGHT!*\n\nA massive dragon blocks the path!\n\n🔥 Ancient Dragon (100 HP)');
        } else {
          await sendGameState(chatId, telegramId, user.location, '⚠️ You need 100 💰 Gold to enter the Boss room!');
        }
      }
      
      // Combat
      else if (data === 'ACT_ATTACK') {
        if (user.location.startsWith('COMBAT') || user.location === 'BOSS_ROOM') {
          const dmg = Math.floor(Math.random() * 15) + 10;
          const enemyDmg = Math.floor(Math.random() * 10) + 5;
          const newEnemyHp = Math.max(0, user.enemy_hp - dmg);
          
          if (newEnemyHp <= 0) {
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
            await sendGameState(chatId, telegramId, nextLocation, victoryMsg);
          } else {
            const newHp = Math.max(0, user.hp - enemyDmg);
            
            if (newHp <= 0) {
              await updateUserInDB(telegramId, { location: 'TAVERN', hp: user.max_hp, enemy_hp: 0 });
              await sendGameState(chatId, telegramId, 'TAVERN', `💀 *DEFEATED!*\n\nThe enemy has defeated you!\n\n🍺 You woke up in the Tavern with full HP.`);
            } else {
              await updateUserInDB(telegramId, { enemy_hp: newEnemyHp, hp: newHp });
              await sendGameState(chatId, telegramId, user.location, `⚔️ You dealt *${dmg}* damage!\n❤️ You took *${enemyDmg}* damage!\n\n🗡️ Enemy: ${newEnemyHp} HP\n❤️ You: ${newHp} HP`);
            }
          }
        }
      } else if (data === 'ACT_DEFEND') {
        const blockChance = Math.random();
        if (blockChance > 0.5) {
          await sendGameState(chatId, telegramId, user.location, `🛡️ You successfully blocked the attack!`);
        } else {
          const dmg = Math.floor(Math.random() * 5) + 2;
          const newHp = Math.max(0, user.hp - dmg);
          await updateUserInDB(telegramId, { hp: newHp });
          await sendGameState(chatId, telegramId, user.location, `🛡️ Partially blocked!\n❤️ You took ${dmg} damage. (HP: ${newHp})`);
        }
      } else if (data === 'ACT_FLEE') {
        await updateUserInDB(telegramId, { location: 'VILLAGE', enemy_hp: 0 });
        await sendGameState(chatId, telegramId, 'VILLAGE', '🏃 You fled! You returned to the village.');
      } else if (data === 'RESET') {
        await updateUserInDB(telegramId, { location: 'VILLAGE', hp: 100, gold: 0, enemy_hp: 0 });
        await sendGameState(chatId, telegramId, 'VILLAGE', '♻️ *New Adventure!*\n\n🏘️ You started over in the village.');
      }
    }

    // Handle /start command
    if (message && message.text === '/start') {
      const telegramId = message.from.id;
      const user = await getUserFromDB(telegramId);
      const currentLocation = user.location || 'START';
      await sendGameState(message.chat.id, telegramId, currentLocation);
    }

    // Handle /play command
    if (message && message.text === '/play') {
      await bot.sendMessage(message.chat.id, '🎮 *Open Well Dungeon Web App:*', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🎮 PLAY NOW', web_app: { url: webAppUrl } }
          ]]
        }
      });
    }

    res.status(200).json({ ok: true });
  } else {
    res.status(200).send('Bot is running on Vercel!');
  }
};
