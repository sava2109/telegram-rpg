const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvpddcwimzaolmsxrxys.supabase.co';
const supabaseServiceKey = 'sb_secret_-GweJ3rCzFBI4-vsGMrABA_GYi3GK12';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateDatabase() {
  console.log('Adding location and enemy_hp columns...');
  
  // Supabase ne dozvoljava direktno ALTER TABLE preko JS API-ja
  // Moram da koristim SQL Editor u Supabase Dashboard
  
  // Ali mogu da postavim default vrednosti za postojeće redove
  const { data: users, error: fetchError } = await supabase.from('users').select('telegram_id');
  
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  console.log(`Found ${users.length} users. Will set default values...`);
  
  // Ažuriraj sve korisnike sa default vrednostima (ako su kolone već dodate)
  for (const user of users) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ location: 'START', enemy_hp: 0 })
      .eq('telegram_id', user.telegram_id);
    
    if (updateError) {
      console.error(`Error updating user ${user.telegram_id}:`, updateError.message);
    } else {
      console.log(`✓ Updated user ${user.telegram_id}`);
    }
  }
  
  console.log('\n✅ Migration complete!');
  console.log('\nIMPORTANT: If you got errors about missing columns, add them in Supabase Dashboard:');
  console.log('https://supabase.com/dashboard/project/fvpddcwimzaolmsxrxys/editor');
  console.log('\nSQL Commands to run in SQL Editor:');
  console.log('ALTER TABLE users ADD COLUMN location TEXT DEFAULT \'START\';');
  console.log('ALTER TABLE users ADD COLUMN enemy_hp INTEGER DEFAULT 0;');
}

migrateDatabase();
