const TelegramBot = require('node-telegram-bot-api');

const token = '8583053385:AAHA4czA1x0Lb66kfwt6xLJBJxhmCJkj-xU';
const webAppUrl = 'https://telegram-8h3a60x01-savas-projects-5ff1ad2b.vercel.app/';

const bot = new TelegramBot(token, { polling: false });

async function setupMenuButton() {
  try {
    // Postavi Menu Button za sve korisnike
    await bot.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: '🎮 Play Game',
        web_app: {
          url: webAppUrl
        }
      }
    });
    
    console.log('✅ Menu Button postavljen uspešno!');
    console.log('URL:', webAppUrl);
  } catch (error) {
    console.error('❌ Greška:', error.message);
  }
}

setupMenuButton();
