const TelegramBot = require('node-telegram-bot-api');

const token = '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';
const webAppUrl = 'https://telegram-rpg-ten.vercel.app';

const bot = new TelegramBot(token, { polling: false });

async function setupWebApp() {
  try {
    // 1. Postavi Menu Button
    const menuResult = await bot.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: 'Play Game',
        web_app: { url: webAppUrl }
      }
    });
    console.log('✅ Menu Button postavljen:', menuResult);

    // 2. Postavi Bot Commands sa inline keyboard
    await bot.setMyCommands([
      { command: 'start', description: 'Pokreni igru' },
      { command: 'play', description: 'Otvori Web App' }
    ]);
    console.log('✅ Komande postavljene');

    // 3. Proveri info o botu
    const botInfo = await bot.getMe();
    console.log('\n📱 Bot Info:');
    console.log('   Username:', botInfo.username);
    console.log('   ID:', botInfo.id);
    console.log('\n🔗 Web App URL:', webAppUrl);
    console.log('\n✅ Setup završen! Probaj:');
    console.log('   1. Otvori bota u Telegramu');
    console.log('   2. Klikni Menu Button (donje levo)');
    console.log('   3. Ili pošalji /play');
    
  } catch (error) {
    console.error('❌ Greška:', error.message);
  }
}

setupWebApp();
