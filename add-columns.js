const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvpddcwimzaolmsxrxys.supabase.co';
const supabaseServiceKey = 'sb_secret_-GweJ3rCzFBI4-vsGMrABA_GYi3GK12';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColumns() {
  console.log('Checking if columns exist...');
  
  // Check current schema
  const { data: users, error } = await supabase.from('users').select('*').limit(1);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Current user columns:', Object.keys(users[0] || {}));
  console.log('\nNote: If location and enemy_hp are missing, add them manually in Supabase Dashboard:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Table Editor > users');
  console.log('4. Click "Add Column"');
  console.log('   - Name: location, Type: text, Default: START');
  console.log('   - Name: enemy_hp, Type: int4, Default: 0');
}

addColumns();
