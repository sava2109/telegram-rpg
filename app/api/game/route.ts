import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const TELEGRAM_BOT_TOKEN = '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';

async function sendTelegramMessage(chatId: number, text: string, buttons: any[]) {
  try {
    const keyboard = buttons.length > 0 ? {
      inline_keyboard: buttons.map(row => 
        Array.isArray(row) ? row.map(btn => ({
          text: btn.text,
          callback_data: btn.callback_data
        })) : [{
          text: row.text,
          callback_data: row.callback_data
        }]
      )
    } : undefined;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
  } catch (e) {
    console.error('Telegram send error:', e);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, user: telegramUser } = body;

  if (!telegramUser || !telegramUser.id) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  const telegramId = telegramUser.id;

  // 1. Get or Create User
  let { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (!user) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        telegram_id: telegramId,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        hp: 100,
        max_hp: 100,
        gold: 0,
        location: 'START',
        enemy_hp: 0
      })
      .select()
      .single();
    
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    user = newUser;
  }

  // Ensure location exists
  if (!user.location) {
    user.location = 'START';
  }

  // 2. Handle Actions
  let message = '';
  let type = 'info';
  let updates: any = {};
  let buttons = [];

  switch (action) {
    case 'init':
      message = getCurrentLocationMessage(user.location, user);
      buttons = getButtonsForLocation(user.location, user);
      break;

    // === NAVIGATION ===
    case 'GOTO_VILLAGE':
      updates.location = 'VILLAGE';
      message = '🏘️ *Selo*\n\nDošao si u mirno selo. Ljudi te pozdravljaju.';
      buttons = getButtonsForLocation('VILLAGE', user);
      break;

    case 'GOTO_FOREST':
      if (Math.random() > 0.6) {
        updates.location = 'COMBAT_GOBLIN';
        updates.enemy_hp = 30;
        message = '⚠️ *PAZI!* Iz žbunja iskače Goblin!\n\n🗡️ Goblin (30 HP)';
        buttons = getButtonsForLocation('COMBAT_GOBLIN', { ...user, enemy_hp: 30 });
      } else {
        updates.location = 'FOREST';
        updates.gold = user.gold + 5;
        message = '🌲 *Mračna Šuma*\n\nMirno je. Pronašao si pečurke. (+5 💰 Gold)';
        buttons = getButtonsForLocation('FOREST', user);
      }
      break;

    case 'GOTO_CAVE':
      if (Math.random() > 0.7) {
        updates.location = 'COMBAT_BAT';
        updates.enemy_hp = 20;
        message = '⚠️ *PAZI!* Slepih miševa napad!\n\n🦇 Giant Bat (20 HP)';
        buttons = getButtonsForLocation('COMBAT_BAT', { ...user, enemy_hp: 20 });
      } else {
        updates.location = 'CAVE';
        message = '🕳️ *Pećina*\n\nVlažno je i mračno. Čuješ kap-kap vode.';
        buttons = getButtonsForLocation('CAVE', user);
      }
      break;

    case 'GOTO_CASTLE':
      updates.location = 'CASTLE';
      message = '🏰 *Napušteni Zamak*\n\nStari kameni zamak. Zvuči jezivo.';
      buttons = getButtonsForLocation('CASTLE', user);
      break;

    case 'GOTO_CRYPT':
      if (Math.random() > 0.5) {
        updates.location = 'COMBAT_SKELETON';
        updates.enemy_hp = 40;
        message = '⚠️ *PAZI!* Kostur oživljava!\n\n💀 Skeleton Warrior (40 HP)';
        buttons = getButtonsForLocation('COMBAT_SKELETON', { ...user, enemy_hp: 40 });
      } else {
        updates.location = 'CRYPT';
        message = '⚰️ *Kripta*\n\nZlokobni kovčezi svuda. Rune svetle zeleno.';
        buttons = getButtonsForLocation('CRYPT', user);
      }
      break;

    case 'GOTO_TREASURE':
      updates.location = 'TREASURE_ROOM';
      const treasureGold = Math.floor(Math.random() * 50) + 20;
      updates.gold = user.gold + treasureGold;
      message = `💎 *Riznica!*\n\nPronašao si sanduk sa blagom! (+${treasureGold} 💰 Gold)`;
      buttons = getButtonsForLocation('TREASURE_ROOM', user);
      break;

    case 'GOTO_TAVERN':
      updates.location = 'TAVERN';
      updates.hp = user.max_hp;
      message = '🍺 *Taverna*\n\nTopla atmosfera. Odmaraš se pored kamina.\n❤️ HP vraćen na maximum!';
      buttons = getButtonsForLocation('TAVERN', user);
      break;

    case 'GOTO_WELL':
      updates.location = 'WELL';
      message = '🕳️ *Duboki Bunar*\n\nSpiralne stepenice vode duboko dole. Čuješ vode.';
      buttons = getButtonsForLocation('WELL', user);
      break;

    case 'GOTO_BOSS':
      if (user.gold >= 100) {
        updates.location = 'BOSS_ROOM';
        updates.enemy_hp = 100;
        message = '🐉 *BOSS FIGHT!*\n\nOgroman zmaj blokira put!\n\n🔥 Ancient Dragon (100 HP)';
        buttons = getButtonsForLocation('BOSS_ROOM', { ...user, enemy_hp: 100 });
      } else {
        message = '⚠️ Trebaš 100 💰 Gold da uđeš u Boss sobu!';
        buttons = getButtonsForLocation(user.location, user);
      }
      break;

    case 'ACT_ATTACK':
      if (user.location.startsWith('COMBAT') && user.enemy_hp > 0) {
        const dmg = Math.floor(Math.random() * 15) + 10;
        const enemyDmg = Math.floor(Math.random() * 10) + 5;
        const newEnemyHp = Math.max(0, user.enemy_hp - dmg);
        
        if (newEnemyHp <= 0) {
          // Victory!
          let reward = 10;
          let nextLocation = 'VILLAGE';
          
          if (user.location === 'BOSS_ROOM') {
            reward = 200;
            nextLocation = 'VICTORY';
            updates.location = 'VICTORY';
            updates.enemy_hp = 0;
            updates.gold = user.gold + reward;
            message = `🏆 *EPSKA POBEDA!*\n\nUbio si Zmaja! Oslobodio si kraljevstvo!\n\n💰 +${reward} Gold\n\n🎉 IGRA ZAVRŠENA!`;
            buttons = [{ id: 'RESET', label: '🔄 Nova igra' }];
          } else {
            updates.location = nextLocation;
            updates.enemy_hp = 0;
            updates.gold = user.gold + reward;
            message = `🏆 *POBEDA!*\n\nUbio si neprijatelja! (+${reward} 💰 Gold)`;
            buttons = getButtonsForLocation(nextLocation, user);
          }
        } else {
          updates.enemy_hp = newEnemyHp;
          const newHp = Math.max(0, user.hp - enemyDmg);
          updates.hp = newHp;
          
          if (newHp <= 0) {
            updates.location = 'TAVERN';
            updates.hp = user.max_hp;
            updates.enemy_hp = 0;
            message = `💀 *PORAŽEN!*\n\nNeprijatelj te je pobedio!\n\n🍺 Probudio si se u Taverni sa punim HP.`;
            buttons = getButtonsForLocation('TAVERN', user);
          } else {
            message = `⚔️ Udario si za *${dmg}* štete!\n❤️ Primio si *${enemyDmg}* štete!\n\n🗡️ Neprijatelj: ${newEnemyHp} HP\n❤️ Ti: ${newHp} HP`;
            buttons = getButtonsForLocation(user.location, { ...user, enemy_hp: newEnemyHp, hp: newHp });
          }
        }
        type = 'combat';
      }
      break;

    case 'ACT_DEFEND':
      const blockChance = Math.random();
      if (blockChance > 0.5) {
        message = `🛡️ Uspešno si blokirao napad!`;
      } else {
        const dmg = Math.floor(Math.random() * 5) + 2;
        updates.hp = Math.max(0, user.hp - dmg);
        message = `🛡️ Delimično si blokirao!\n❤️ Primio si ${dmg} štete. (HP: ${updates.hp})`;
      }
      buttons = getButtonsForLocation(user.location, user);
      break;

    case 'ACT_FLEE':
      updates.location = 'VILLAGE';
      updates.enemy_hp = 0;
      message = '🏃 Pobegao si! Vratio si se u selo.';
      buttons = getButtonsForLocation('VILLAGE', user);
      break;

    case 'RESET':
      updates.location = 'VILLAGE';
      updates.hp = 100;
      updates.gold = 0;
      updates.enemy_hp = 0;
      message = '♻️ *Nova Avantura!*\n\n🏘️ Poče od početka u selu.';
      buttons = getButtonsForLocation('VILLAGE', user);
      break;
  }

  // 3. Save Updates
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('telegram_id', telegramId);
    
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    
    user = { ...user, ...updates };
  }

  // 4. NOVO: Pošalji update u Telegram chat
  if (action !== 'init' && Object.keys(updates).length > 0) {
    // Formatuj dugmiće za Telegram
    const telegramButtons = getButtonsForLocation(user.location, user).map(btn => [{
      text: btn.label,
      callback_data: btn.id
    }]);

    await sendTelegramMessage(telegramId, message, telegramButtons);
  }

  console.log(`✅ User ${telegramId} updated: location=${user.location}, hp=${user.hp}, gold=${user.gold}`);

  return NextResponse.json({ 
    message, 
    type,
    location: user.location,
    buttons,
    userStats: { 
      hp: user.hp, 
      max_hp: user.max_hp, 
      gold: user.gold,
      location: user.location,
      enemy_hp: user.enemy_hp || 0
    } 
  });
}

function getCurrentLocationMessage(location: string, user: any): string {
  switch (location) {
    case 'START': return '👋 Dobrodošao u Well Dungeon!';
    case 'VILLAGE': return '🏘️ Mirno selo. Ljudi rade svoje poslove.';
    case 'FOREST': return '🌲 Mračna šuma te okružuje.';
    case 'CAVE': return '🕳️ Vlažna pećina. Čuješ eho.';
    case 'CASTLE': return '🏰 Napušteni zamak. Vrata su otvorena.';
    case 'CRYPT': return '⚰️ Kripta. Kovčezi svuda.';
    case 'TREASURE_ROOM': return '💎 Riznica! Zlato blista.';
    case 'TAVERN': return '🍺 Topla taverna. Sigurno mesto.';
    case 'WELL': return '🕳️ Duboki bunar. Stepenice vode dole.';
    case 'BOSS_ROOM': return `🐉 Boss Arena! Zmaj pred tobom! (${user.enemy_hp || 100} HP)`;
    case 'COMBAT_GOBLIN': return `⚔️ Boriš se protiv Goblina! (${user.enemy_hp || 0} HP)`;
    case 'COMBAT_BAT': return `⚔️ Boriš se protiv Slepe Miševa! (${user.enemy_hp || 0} HP)`;
    case 'COMBAT_SKELETON': return `⚔️ Boriš se protiv Kostura! (${user.enemy_hp || 0} HP)`;
    case 'VICTORY': return '🏆 POBEDNIK! Završio si igru!';
    default: return 'Gde si?';
  }
}

function getButtonsForLocation(location: string, user: any): any[] {
  switch (location) {
    case 'START':
    case 'VILLAGE':
      return [
        { id: 'GOTO_FOREST', label: '🌲 Idi u Šumu' },
        { id: 'GOTO_CAVE', label: '🕳️ Idi u Pećinu' },
        { id: 'GOTO_CASTLE', label: '🏰 Idi u Zamak' },
        { id: 'GOTO_TAVERN', label: '🍺 Idi u Taverna' },
        { id: 'GOTO_WELL', label: '🕳️ Idi u Bunar' }
      ];
    
    case 'FOREST':
      return [
        { id: 'GOTO_CAVE', label: '🕳️ Istraži Pećinu' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'CAVE':
      return [
        { id: 'GOTO_CRYPT', label: '⚰️ Spusti se u Kriptu' },
        { id: 'GOTO_TREASURE', label: '💎 Potraži Blago' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'CASTLE':
      return [
        { id: 'GOTO_CRYPT', label: '⚰️ Spusti se u Kriptu' },
        { id: 'GOTO_BOSS', label: '🐉 Boss Arena (100💰)' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'CRYPT':
      return [
        { id: 'GOTO_TREASURE', label: '💎 Potraži Blago' },
        { id: 'GOTO_CASTLE', label: '🏰 Nazad u Zamak' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'TREASURE_ROOM':
      return [
        { id: 'GOTO_CAVE', label: '🕳️ Nazad u Pećinu' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'TAVERN':
      return [
        { id: 'GOTO_VILLAGE', label: '🏘️ Izađi u Selo' },
        { id: 'RESET', label: '🔄 Nova Igra' }
      ];
    
    case 'WELL':
      return [
        { id: 'GOTO_CAVE', label: '🕳️ Siđi u Pećinu' },
        { id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }
      ];
    
    case 'BOSS_ROOM':
    case 'COMBAT_GOBLIN':
    case 'COMBAT_BAT':
    case 'COMBAT_SKELETON':
      return [
        { id: 'ACT_ATTACK', label: '⚔️ Napadni' },
        { id: 'ACT_DEFEND', label: '🛡️ Brani se' },
        { id: 'ACT_FLEE', label: '🏃 Beži' }
      ];
    
    case 'VICTORY':
      return [
        { id: 'RESET', label: '🔄 Nova Igra' }
      ];
    
    default:
      return [{ id: 'GOTO_VILLAGE', label: '🏘️ Nazad u Selo' }];
  }
}
