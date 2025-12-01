require('dotenv').config({ path: '.env.local' });
const TelegramBot = require('node-telegram-bot-api');

// Replace with your token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = 'https://telegram-rpg-2tu4.vercel.app/';

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN is missing in .env.local');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(chatId, 'Welcome to the Dungeon! ⚔️\nClick the button below to start your adventure.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Play Game 🎮', web_app: { url: webAppUrl } }]
        ]
      }
    });
  }
});

console.log('Bot is running...');
