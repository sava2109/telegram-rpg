import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
        gold: 0
      })
      .select()
      .single();
    
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    user = newUser;
  }

  // 2. Handle Actions
  let message = '';
  let type = 'info';
  let updates = {};

  switch (action) {
    case 'explore':
      const encounter = Math.random();
      if (encounter > 0.7) {
        message = 'You found a hidden chest! +10 Gold.';
        type = 'loot';
        updates = { gold: user.gold + 10 };
      } else if (encounter > 0.3) {
        const damage = Math.floor(Math.random() * 10) + 1;
        message = `A goblin ambushed you! You took ${damage} damage.`;
        type = 'combat';
        updates = { hp: Math.max(0, user.hp - damage) };
      } else {
        message = 'You explore the dark corridors... nothing happens.';
        type = 'info';
      }
      break;

    case 'attack':
      // Simple combat logic
      const dmg = Math.floor(Math.random() * 15) + 5;
      message = `You attacked the darkness for ${dmg} damage!`;
      type = 'combat';
      break;

    case 'heal':
      if (user.gold >= 5) {
        const healAmount = 20;
        updates = { 
          hp: Math.min(user.max_hp, user.hp + healAmount),
          gold: user.gold - 5
        };
        message = 'You paid 5 gold to heal 20 HP.';
        type = 'info';
      } else {
        message = 'Not enough gold to heal!';
        type = 'error';
      }
      break;
  }

  // 3. Save Updates
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('telegram_id', telegramId);
    
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    
    // Update local user object to return
    user = { ...user, ...updates };
  }

  return NextResponse.json({ 
    message, 
    type, 
    userStats: { hp: user.hp, max_hp: user.max_hp, gold: user.gold } 
  });
}
