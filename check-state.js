const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvpddcwimzaolmsxrxys.supabase.co';
const supabaseServiceKey = 'sb_secret_-GweJ3rCzFBI4-vsGMrABA_GYi3GK12';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserState() {
  console.log('🔍 Proveravam stanje u bazi...\n');
  
  const { data: users, error } = await supabase
    .from('users')
    .select('telegram_id, first_name, location, hp, gold, enemy_hp')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('❌ Greška:', error);
    return;
  }
  
  console.log('👥 Poslednji korisnici u bazi:\n');
  users.forEach(user => {
    console.log(`ID: ${user.telegram_id}`);
    console.log(`Ime: ${user.first_name}`);
    console.log(`📍 Lokacija: ${user.location || 'NEMA'}`);
    console.log(`❤️  HP: ${user.hp}`);
    console.log(`💰 Gold: ${user.gold}`);
    console.log(`👹 Enemy HP: ${user.enemy_hp || 0}`);
    console.log('---');
  });
}

checkUserState();
